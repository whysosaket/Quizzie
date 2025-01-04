const expess = require("express");
const router = expess.Router();

const auth = require("./auth");
const quiz = require("./quiz");
const analytics = require("./analytics");

const r = () => {
  auth(router);
  quiz(router);
  analytics(router);
  return router;
};

module.exports = r;