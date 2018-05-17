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
  zillow.get('GetRegionChildren', params).then(results => {
    if (params.city) {
      const getWalkScores = results.response.list.region.map(neighborhood => {
        const key = `${params.state}-${params.county}-${params.city}-${neighborhood.name[0]}`;
        return client.getAsync(key).then(walkscore => {
          if (walkscore) {
            return Promise.resolve({ ...neighborhood, walkscore });
          }

          return axios
            .get(
              `http://api.walkscore.com/score?format=json&address=${neighborhood.name[0]}&lat=${
                neighborhood.latitude[0]
              }&lon=${neighborhood.longitude[0]}&transit=1&bike=1&wsapikey=${process.env.WALKSCORE_KEY}`,
            )
            .then(response => {
              client.set(key, response.data.walkscore, redis.print);
              return Promise.resolve({ ...neighborhood, walkscore: response.data.walkscore });
            });
        });
      });

      return Promise.all(getWalkScores)
        .then(neighborhoodsWithWalkScores => {
          const boundaries = require(`./boundaries/${params.state}.json`); // eslint-disable-line
          const returnVal = { ...results, boundaries };
          returnVal.response.list.region = neighborhoodsWithWalkScores;
          return res.json(returnVal);
        })
        .catch(err => {
          console.log(err);
          return res.status(500).json({ error: 'Something went wrong' });
        });
    }
    return res.json(results);
  });
});

module.exports = router;
