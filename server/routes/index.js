/*
 * Name: index.js
 * Description: Javascript file requiring api.js when making API requests.
 */ 

module.exports = app => {
  app.use("/api", require("./api"));
};
