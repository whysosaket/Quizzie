const { createUser, loginUser, getUser } = require("../controllers/authController");
const fetchuser = require("../middleware/fetchuser");

const auth = (router) => {
  router.route("/api/auth/login").post((req, res) => loginUser(req, res));
  router.route("/api/auth/signup").post((req, res) => createUser(req, res));
  router.route("/api/auth/getuser").get(fetchuser, (req, res) => getUser(req, res));
};

module.exports = auth;