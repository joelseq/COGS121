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
      const boundaries = require(`./boundaries/${params.state}.json`); // eslint-disable-line
      try {
        const walkScoresString = await client.getAsync(key);
        if (walkScoresString !== null) {
          const walkScoresMap = JSON.parse(walkScoresString);
          const returnVal = { ...results, boundaries };
          returnVal.response.list.region = returnVal.response.list.region.map(neighborhood => {
            return Object.assign({}, neighborhood, { walkscore: walkScoresMap[neighborhood.name] });
          });
          return res.json(returnVal);
        }
        const getWalkScores = results.response.list.region.map(neighborhood => {
          return axios
            .get(
              `http://api.walkscore.com/score?format=json&address=${neighborhood.name[0]}&lat=${
                neighborhood.latitude[0]
              }&lon=${neighborhood.longitude[0]}&transit=1&bike=1&wsapikey=${process.env.WALKSCORE_KEY}`,
            )
            .then(response => {
              return Promise.resolve({ [`${neighborhood.name}`]: response.data.walkscore });
            });
        });

        return Promise.all(getWalkScores)
          .then(walkScores => {
            const walkScoresMap = walkScores.reduce((acc, curr) => {
              return Object.assign({}, acc, curr);
            }, {});
            client.set(key, JSON.stringify(walkScoresMap), redis.print);
            const returnVal = { ...results, boundaries };
            returnVal.response.list.region = returnVal.response.list.region.map(neighborhood => {
              return Object.assign({}, neighborhood, { walkscore: walkScoresMap[neighborhood.name] });
            });
            return res.json(returnVal);
          })
          .catch(() => {
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
