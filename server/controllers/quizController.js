const dotenv = require("dotenv");
dotenv.config();

const jwt = require("jsonwebtoken");
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const convertToTitleCase = require("../utils/makeTitleCase");
const generateQuizID = require("../utils/generateQuizID");

const createQuiz = async (req, res) => {
    let success = false;

    let user = req.user;
    
    let { name, type, questions } = req.body;
    name = name.toString().toLowerCase();
    type = type.toString().toLowerCase();
    
    try {

        user = await User.findOne({ _id: user.id });
        if (!user) {
            return res.json({ success, error: "User Not Found!" });
        }

        if (name.length < 6) {
        return res.json({
            success,
            error: "Quiz Name must be at least 6 characters long!",
        });
        }
    
        name = convertToTitleCase(name);
    
        if (type !== "qna" && type !== "poll") {
        return res.json({
            success,
            error: "Quiz Type can only be QnA or Poll!",
        });
        }
    
        if (questions.length < 1) {
        return res.json({
            success,
            error: "Quiz must have at least 1 question!",
        });
        }

        // generating Quiz ID
        let quizID = generateQuizID();
        // checking if Quiz ID already exists
        let quizidtest = await Quiz.findOne({ quizID: quizID });
        while (quizidtest) {
            quizID = generateQuizID();
            quizidtest = await Quiz.findOne({ quizID: quizID });
        }

        // Validating each Question
        for (let i = 0; i < questions.length; i++) {
            let question = questions[i];
            let { questionText, optionType, correctAnswer, options } = question;
            if (questionText.length < 4) {
                return res.json({
                    success,
                    error: `Question ${i + 1} must be at least 4 characters long!`,
                });
            }
            if (optionType !== "text" && optionType !== "img" && optionType !== "both") {
                return res.json({
                    success,
                    error: `Question ${i + 1} Option Type can only be Text, Image, Both!`,
                });
            }
            if (options.length < 2) {
                return res.json({
                    success,
                    error: `Question ${i + 1} must have at least 2 options!`,
                });
            }

            // Validating each Option

            for (let j = 0; j < options.length; j++) {
                let option = options[j];
                if (option.length < 1) {
                    return res.json({
                        success,
                        error: `Question ${i + 1} Option ${j + 1} must be at least 1 character long!`,
                    });
                }
            }

            // Validating correct Answer

            if (optionType === "text" || optionType === "both") {
                if (correctAnswer.length < 1) {
                    return res.json({
                        success,
                        error: `Question ${i + 1} Correct Answer must be at least 1 character long!`,
                    });
                }
            }

            // Validating correct Answer

            if (optionType === "img" || optionType === "both") {
                if (correctAnswer.length < 1) {
                    return res.json({
                        success,
                        error: `Question ${i + 1} Correct Answer must be at least 1 character long!`,
                    });
                }
            }
        }

        let finalQuestions = [];

        // Creating each Question
        for(let i=0;i<questions.length;i++){
            let question = questions[i];
            let { questionText, optionType, correctAnswer, options, imageOptions } = question;

            let newQuestion = await Question.create({
                question: questionText,
                optionType,
                quiz: quizID,
                correctAnswer,
                options,
                imageOptions
            });

            finalQuestions.push(newQuestion._id);
        }
    
        const newQuiz = await Quiz.create({
        name,
        type,
        questions: finalQuestions,
        quizID,
        user: user._id,
        });

        user.quizCreated = user.quizCreated + 1;
        user.questionsCreated = user.questionsCreated + questions.length;
        await user.save();

        success = true;
        return res.json({ success, info: "Quiz Created Successfully!!" });
    } catch (error) {
        console.log(error);
        return res.json({ error: "Something Went Wrong!" });
    }
    }
    
    const getQuiz = async (req, res) => {
    let success = false;
    let quizID = req.params.quizID;
    try {
        let quiz = await Quiz.findOne({ quizID: quizID });
        if (!quiz) {
        return res.json({ success, error: "Quiz Not Found!" });
        }
        // update impressions
        quiz.impressions = quiz.impressions + 1;
        await quiz.save();

        let user = await User.findOne({ _id: quiz.user });
        if (!user) {
            return res.json({ success, error: "User Not Found!" });
        }

        user.impressions = user.impressions + 1;

        success = true;
        return res.json({ success, quiz });
    } catch (error) {
        console.log(error);
        return res.json({ error: "Something Went Wrong!" });
    }
    }

    const takeQuiz = async (req, res) => {
        let success = false;
        let quizID = req.params.quizID;
        let { answers } = req.body;
        try {
            let quiz = await Quiz.findOne({ quizID: quizID });
            if (!quiz) {
            return res.json({ success, error: "Quiz Not Found!" });
            }
            
            let questions = quiz.questions;
            let score = 0;
            let total = questions.length;
            let attempted = 0;
            let correct = 0;
            let incorrect = 0;

            for(let i=0;i<questions.length;i++){
                let question = questions[i];
                let answer = answers[i];
                if(answer !== ""){
                    attempted = attempted + 1;
                    if(answer === question.correctAnswer){
                        correct = correct + 1;
                        score = score + 1;
                    }else{
                        incorrect = incorrect + 1;
                    }
                }
            }

            quiz.attempts = quiz.attempts + 1;
            quiz.correct = quiz.correct + correct;
            quiz.incorrect = quiz.incorrect + incorrect;
            await quiz.save();

            let result = {
                score,
                total,
                attempted,
                correct,
                incorrect
            }

            success = true;
            return res.json({ success, result });
        } catch (error) {
            console.log(error);
            return res.json({ error: "Something Went Wrong!" });
        }
    }

    module.exports = { createQuiz, getQuiz, takeQuiz };
