const expess = require("express");
const router = expess.Router();

const auth = require("./auth");
const quiz = require("./quiz");
// const product = require("./product");
// const view = require("./view");

const r = () => {
  auth(router);
  quiz(router);
//   product(router);
//   view(router);
  return router;
};

module.exports = r;