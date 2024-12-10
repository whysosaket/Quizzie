const {
  createQuiz,
  getQuiz,
  takeQuiz,
  check_attempt,
  save_score,
  deleteQuiz,
  takePoll,
  getTrending,
  getQuestion,
} = require("../controllers/quizController");
const fetchuser = require("../middleware/fetchuser");

const quiz = (router) => {
  router
    .route("/api/quiz/create")
    .post(fetchuser, (req, res) => createQuiz(req, res));
  router
    .route("/api/quiz/check_attempt")
    .get((req, res) => check_attempt(req, res));
  router.route("/api/quiz/save_score").post((req, res) => save_score(req, res));
  router.route("/api/quiz/:quizID").get((req, res) => getQuiz(req, res));
  router.route("/api/quiz/:quizID").post((req, res) => takeQuiz(req, res));
  //socre save
  router
    .route("/api/quiz/:quizID")
    .delete(fetchuser, (req, res) => deleteQuiz(req, res));
  router.route("/api/poll/:quizID").post((req, res) => takePoll(req, res));
  router
    .route("/api/trending")
    .get(fetchuser, (req, res) => getTrending(req, res));
  router
    .route("/api/question/:questionID")
    .get((req, res) => getQuestion(req, res));
};

module.exports = quiz;
