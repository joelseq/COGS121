const express = require('express');
const Zillow = require('node-zillow');

const zwsid = process.env.ZILLOW_ID;
const zillow = new Zillow(zwsid);

const router = express.Router();

const locations = [
  {
    address: '4345 Nobel Dr',
    bedrooms: 3,
    bathrooms: 3,
    walkability: 85,
    safety: 70,
    price: '$2900',
  },
  {
    address: '3435 Lebon Dr',
    bedrooms: 2,
    bathrooms: 2,
    walkability: 55,
    safety: 80,
    price: '$2600',
  },
  {
    address: '9336 Easter Way',
    bedrooms: 3,
    bathrooms: 3,
    walkability: 35,
    safety: 55,
    price: '$2800',
  },
  {
    address: '3995 Mahaila Ave',
    bedrooms: 1,
    bathrooms: 1,
    walkability: 65,
    safety: 65,
    price: '$1900',
  },
];

router.get('/', (req, res) => {
  res.send('Hello World');
});

router.get('/locations', (req, res) => {
  res.json(locations);
});

router.get('/subregion', (req, res) => {
  const params = { ...req.query };
  if (params.city) {
    params.childtype = 'neighborhood';
  }
  zillow.get('GetRegionChildren', params).then(results => {
    if (params.city) {
      const boundaries = require(`./boundaries/${params.state}.json`); // eslint-disable-line
      const ret = { ...results, boundaries };
      return res.json(ret);
    }
    return res.json(results);
  });
});

module.exports = router;
