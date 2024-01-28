const dotenv = require("dotenv");
dotenv.config();

const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const User = require("../models/User");


const getAllQuiz = async (req, res) => {
    let success = false;
    let user = req.user;

    try {
        let quizzes = await Quiz.find({ user: user.id }, "name impressions createdOn type quizID");
        success = true;
        return res.json({ success, quizzes });
    }
    catch (error) {
        console.log(error);
        return res.json({ error: "Something Went Wrong!" });
    }
}

const getQuestions = async (req, res) => {
    let success = false;
    let user = req.user;
    let { quizid } = req.body;

    try {
        let quiz = await Quiz.findOne({ user: user.id, quizID: quizid }, "name impressions createdOn type quizID");
        if (!quiz) {
            return res.json({ error: "Quiz Not Found!" });
        }
        let questions = await Question.find({ quiz: quizid }, "question type options attempts correct incorrect optedOption1 optedOption2 optedOption3 optedOption4");
        success = true;
        return res.json({ success, questions, quiz });
    }
    catch (error) {
        console.log(error);
        return res.json({ error: "Something Went Wrong!" });
    }
}

module.exports = {getAllQuiz, getQuestions};