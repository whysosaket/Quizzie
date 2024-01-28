const expess = require("express");
const router = expess.Router();

const auth = require("./auth");
// const product = require("./product");
// const view = require("./view");

const r = () => {
  auth(router);
//   product(router);
//   view(router);
  return router;
};

module.exports = r;