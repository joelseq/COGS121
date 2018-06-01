const express = require('express');
const Zillow = require('node-zillow');
const redis = require('redis');
const axios = require('axios');
const bluebird = require('bluebird');

// Promisify redis
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const zwsid = process.env.ZILLOW_ID;
const zillow = new Zillow(zwsid);

const router = express.Router();

// Create a Redis client
const client = redis.createClient(process.env.REDIS_URL);

client.on('connect', () => {
  console.log('Redis client connected');
});

client.on('error', err => {
  console.log(`Something went wrong ${err}`);
});

const getWalkScores = neighborhoods => {
  return neighborhoods.map(neighborhood => {
    return axios
      .get(
        `http://api.walkscore.com/score?format=json&address=${neighborhood.name[0]}&lat=${
          neighborhood.latitude[0]
        }&lon=${neighborhood.longitude[0]}&transit=1&bike=1&wsapikey=${process.env.WALKSCORE_KEY}`,
      )
      .then(response => {
        return Promise.resolve({
          neighborhood: neighborhood.name,
          walkscore: response.data.walkscore,
        });
      });
  });
};

// Calculate the average of an array of scores
const getAvgScore = scores => Math.round(scores.reduce((acc, curr) => acc + curr, 0) / scores.length);

const getSchoolScores = (neighborhoods, state) => {
  return neighborhoods.map(neighborhood => {
    const { latitude, longitude } = neighborhood;
    // Find all public or charter schools within a 2 mile radius of given neighborhood
    return axios
      .get(
        `https://api.greatschools.org/schools/nearby?format=json&key=${process.env.SCHOOLS_KEY}&state=${state}&lat=${
          latitude[0]
        }&lon=${longitude[0]}&radius=2&schoolType=public-charter`,
      )
      .then(response => {
        let avgScore = null;
        // Get the average score from all the Great School ratings
        const { schools } = response.data;
        if (schools && schools.school && Array.isArray(schools.school)) {
          avgScore = getAvgScore(schools.school.map(school => school.gsRating));
        }
        return Promise.resolve({
          neighborhood: neighborhood.name,
          schoolscore: avgScore,
        });
      });
  });
};

router.get('/', (req, res) => {
  res.send('Hello World');
});

router.get('/subregion', async (req, res) => {
  const params = { ...req.query };
  if (params.city) {
    params.childtype = 'neighborhood';
  }
  zillow.get('GetRegionChildren', params).then(async results => {
    if (params.city) {
      const key = `${params.state}-${params.county}-${params.city}`;
      let boundaries = require(`./boundaries/${params.state}.json`); // eslint-disable-line
      // Filter out boundaries that are not part of the city
      boundaries = boundaries.features.filter(region => region.properties.City === params.city);
      try {
        const scoresString = await client.getAsync(key);
        if (scoresString !== null) {
          const scoresMap = JSON.parse(scoresString);
          const returnVal = { ...results, boundaries };
          returnVal.response.list.region = returnVal.response.list.region.map(neighborhood => {
            return Object.assign({}, neighborhood, {
              walkscore: scoresMap[neighborhood.name].walkscore,
              schoolscore: scoresMap[neighborhood.name].schoolscore,
            });
          });
          return res.json(returnVal);
        }

        return Promise.all([
          ...getWalkScores(results.response.list.region),
          ...getSchoolScores(results.response.list.region, params.state),
        ])
          .then(scores => {
            const scoresMap = {};
            scores.forEach(score => {
              if (!scoresMap[score.neighborhood]) {
                scoresMap[score.neighborhood] = {};
              }
              if (score.walkscore) {
                scoresMap[score.neighborhood].walkscore = score.walkscore;
              } else {
                scoresMap[score.neighborhood].schoolscore = score.schoolscore;
              }
            });
            client.set(key, JSON.stringify(scoresMap), redis.print);
            const returnVal = { ...results, boundaries };
            returnVal.response.list.region = returnVal.response.list.region.map(neighborhood => {
              return Object.assign({}, neighborhood, {
                walkscore: scoresMap[neighborhood.name].walkscore,
                schoolscore: scoresMap[neighborhood.name].schoolscore,
              });
            });
            return res.json(returnVal);
          })
          .catch(error => {
            console.log(error);
            return res.status(500).json({ error: 'Something went wrong' });
          });
      } catch (error) {
        return res.status(500).json({ error: 'Something went wrong' });
      }
    }
    return res.json(results);
  });
});

module.exports = router;
