const dotenv = require("dotenv");
dotenv.config();
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const User = require("../models/User");
const QuizResult = require("../models/QuizResult");
const Emails = require("../models/Emails");

const convertToTitleCase = require("../utils/makeTitleCase");
const generateQuizID = require("../utils/generateQuizID");
const isValidEmail = require("../utils/isValidEmail");

const delimeter = "@1&2^";

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

    // get user quiz with same name
    let testquiz = await Quiz.findOne({
      name: convertToTitleCase(name),
      user: user._id,
    });
    if (testquiz) {
      return res.json({
        success,
        error: "You already have a Quiz with this name!",
      });
    }

    if (name.length < 3) {
      return res.json({
        success,
        error: "Quiz Name must be at least 3 characters long!",
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
      let {
        question: questionText,
        optionType,
        correctAnswer,
        options,
        imageOptions,
      } = question;
      if (questionText.length < 4) {
        return res.json({
          success,
          error: `Question ${i + 1} must be at least 4 characters long!`,
        });
      }

      // timer validation
      if (question.timer) {
        if (
          question.timer !== 30 &&
          question.timer !== 90 &&
          question.timer !== 60
        ) {
          return res.json({
            success,
            error: `Question ${i + 1} Timer can only be 30, 90 or 60!`,
          });
        }
      }

      if (
        optionType !== "text" &&
        optionType !== "img" &&
        optionType !== "both"
      ) {
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
        if (option === null) continue;
        if (option.length < 1) {
          return res.json({
            success,
            error: `Question ${i + 1} Option ${
              j + 1
            } must be at least 1 character long!`,
          });
        }
      }

      // Validating each Image Option

      for (let j = 0; j < imageOptions.length; j++) {
        let option = imageOptions[j];
        if (option === null) continue;
        if (option.length < 1) {
          return res.json({
            success,
            error: `Question ${i + 1} Option ${
              j + 1
            } must be at least 1 character long!`,
          });
        }
      }

      // Validating correct Answer
      if (optionType === "text" || optionType === "both") {
        if (type === "poll") {
          correctAnswer = "NA";
        } else if (correctAnswer.length < 1) {
          return res.json({
            success,
            error: `Question ${
              i + 1
            } Correct Answer must be at least 1 character long!`,
          });
        }
      }

      if (optionType === "img" || optionType === "both") {
        if (type === "poll") {
          correctAnswer = "NA";
        } else if (correctAnswer.length < 1) {
          return res.json({
            success,
            error: `Question ${
              i + 1
            } Correct Answer must be at least 1 character long!`,
          });
        }
      }
    }

    let finalQuestions = [];

    for (let i = 0; i < questions.length; i++) {
      let question = questions[i];
      let {
        question: questionText,
        optionType,
        correctAnswer,
        options,
        imageOptions,
        timer,
      } = question;

      if (type === "poll") {
        correctAnswer = "NA";
      }

      let newQuestion = await Question.create({
        question: questionText,
        optionType,
        quiz: quizID,
        correctAnswer,
        options,
        imageOptions,
        type,
        timer,
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
    return res.json({
      success,
      info: "Quiz Created Successfully!!",
      quizID: newQuiz.quizID,
    });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Something Went Wrong!" });
  }
};

const check_attempt = async (req, res) => {
  const { email, regNo } = req.query;
  if (regNo == "") {
    return res.json({
      success: true,
      message: "Enter a valid registration number.",
    });
  }
  const existingEmail = await Emails.findOne({ email });
  if (!existingEmail) {
    return res.json({
      success: true,
      message: "You have not registered for this event with the given email.",
    });
  }
  try {
    const attempt = await QuizResult.findOne({
      $or: [{ email: email }, { regNo: regNo }],
    });

    if (attempt) {
      return res.json({
        success: true,
        message: "You already attempted the quiz.",
      });
    } else {
      return res.json({ success: false });
    }
  } catch (error) {
    console.error("Error checking quiz attempt:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getQuiz = async (req, res) => {
  let success = false;
  let quizID = req.params.quizID;
  try {
    let quiz = await Quiz.findOne({ quizID: quizID });
    if (!quiz) {
      return res.json({ success, error: "Quiz Not Found!" });
    }
    quiz.impressions = quiz.impressions + 1;
    await quiz.save();

    let user = await User.findOne({ _id: quiz.user });
    if (!user) {
      return res.json({ success, error: "User Not Found!" });
    }

    user.totalImpressions = user.totalImpressions + 1;
    await user.save();

    success = true;
    return res.json({ success, quiz });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Something Went Wrong!" });
  }
};

const takeQuiz = async (req, res) => {
  let success = false;
  let quizID = req.params.quizID;

  if (!quizID) {
    return res.json({ success, error: "Quiz ID is required!" });
  }

  let { answers, email, regNo, takeQuizQuestions, questionTimers } = req.body;

  try {
    let quiz = await Quiz.findOne({ quizID });
    if (!quiz) {
      return res.json({ success: false, error: "Quiz Not Found!" + quizID });
    }

    if (quiz.type !== "qna") {
      return res.json({ success: false, error: "This is not a QnA Quiz!" });
    }

    let questions = takeQuizQuestions;
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.json({
        success: false,
        error: "No questions found in the quiz!",
      });
    }

    const allQuestions = await Question.find({});

    let score = 0;
    let total = questions.length;
    let attempted = 0;
    let correct = 0;
    let incorrect = 0;
    const questionAnswerPairs = [];
    for (let i = 0; i < total; i++) {
      let question = questions[i];
      let answer = answers[i] || "";

      let ques = allQuestions.find((q) => q._id.toString() === question._id);
      if (!ques) {
        return res.json({
          success: false,
          error: `Question ${i + 1} Not Found!`,
        });
      }

      if (answer !== "") {
        attempted++;
        if (answer === ques.correctAnswer) {
          correct++;
          if (ques.timer === 30) score += 1;
          else if (ques.timer === 60) score += 1.5;
          else if (ques.timer === 90) score += 2;
          ques.correct = (ques.correct || 0) + 1;
        } else {
          incorrect++;
          ques.incorrect = (ques.incorrect || 0) + 1;
        }
      }
      questionAnswerPairs.push({ question, answer });
      ques.attempts = (ques.attempts || 0) + 1;
      await ques.save();
    }

    let results = {
      score,
      total,
      attempted,
      correct,
      incorrect,
      questionAnswerPairs,
      questionTimers,
    };

    // Save Score
    const existingResult = await QuizResult.findOne({ email, regNo });
    if (existingResult) {
      return res
        .status(400)
        .json({ success: false, error: "You have already taken this quiz." });
    }

    const formattedQuestionAnswerPairs = questionAnswerPairs.map((pair) => ({
      questionID: pair.question._id,
      answer: pair.answer,
    }));

    let emailData = await Emails.findOne({ email });
    if (!emailData) {
      return res.json({ success: false, error: "Email Not Found!" });
    }
    emailData.quizStatus = "completed";
    await emailData.save();

    // Save
    const result = new QuizResult({
      quizID,
      email,
      regNo,
      score,
      total,
      questionTimers,
      formattedQuestionAnswerPairs,
    });
    await result.save();
    

    success = true;
    return res.json({ success, result: results });
  } catch (error) {
    console.error("Error in takeQuiz:", error);
    return res.json({ success: false, error: "Something Went Wrong!" });
  }
};

const save_score = async (req, res) => {
  const {
    quizID,
    email,
    regNo,
    score,
    total,
    questionTimers,
    questionAnswerPairs,
  } = req.body;

  try {
    const existingResult = await QuizResult.findOne({ email, regNo });
    if (existingResult) {
      return res
        .status(400)
        .json({ success: false, error: "You have already taken this quiz." });
    }

    const formattedQuestionAnswerPairs = questionAnswerPairs.map((pair) => ({
      questionID: pair.question._id,
      answer: pair.answer,
    }));

    let emailData = await Emails.findOne({ email });
    if (!emailData) {
      return res.json({ success: false, error: "Email Not Found!" });
    }
    emailData.quizStatus = "completed";
    await emailData.save();

    // Save
    const result = new QuizResult({
      quizID,
      email,
      regNo,
      score,
      total,
      questionTimers,
      formattedQuestionAnswerPairs,
    });
    await result.save();
    res.json({ success: true, message: "Score saved successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to save score." });
  }
};

const takePoll = async (req, res) => {
  let success = false;
  let quizID = req.params.quizID;
  let { answers } = req.body;
  try {
    let quiz = await Quiz.findOne({ quizID: quizID });
    if (!quiz) {
      return res.json({ success, error: "Quiz Not Found!" });
    }

    if (quiz.type !== "poll") {
      return res.json({ success, error: "This is not a Poll!" });
    }

    let questions = quiz.questions;

    for (let i = 0; i < questions.length; i++) {
      let question = questions[i];
      let answer = answers[i];

      let ques = await Question.findOne({ _id: question });
      if (!ques) {
        return res.json({ success, error: "Question Not Found!" });
      }

      if (ques.optionType === "text") {
        answer = answer.split(delimeter)[0];
      } else if (ques.optionType === "img") {
        answer = answer.split(delimeter)[1];
      } else if (ques.optionType === "both") {
        answer = answer.split(delimeter)[0] + answer.split(delimeter)[1];
      }

      if (ques.optionType === "text") {
        if (answer === ques.options[0]) ques.optedOption1 += 1;
        else if (answer === ques.options[1]) ques.optedOption2 += 1;
        else if (answer === ques.options[2]) ques.optedOption3 += 1;
        else if (answer === ques.options[3]) ques.optedOption4 += 1;
      }

      if (ques.optionType === "img") {
        if (answer === ques.imageOptions[0]) ques.optedOption1 += 1;
        else if (answer === ques.imageOptions[1]) ques.optedOption2 += 1;
        else if (answer === ques.imageOptions[2]) ques.optedOption3 += 1;
        else if (answer === ques.imageOptions[3]) ques.optedOption4 += 1;
      }

      if (ques.optionType === "both") {
        if (answer === ques.options[0] + ques.imageOptions[0])
          ques.optedOption1 += 1;
        else if (answer === ques.options[1] + ques.imageOptions[1])
          ques.optedOption2 += 1;
        else if (answer === ques.options[2] + ques.imageOptions[2])
          ques.optedOption3 += 1;
        else if (answer === ques.options[3] + ques.imageOptions[3])
          ques.optedOption4 += 1;
      }

      ques.attempts = ques.attempts + 1;
      await ques.save();
    }

    success = true;
    return res.json({ success, info: "Poll Submitted Successfully!!" });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Something Went Wrong!" });
  }
};

const deleteQuiz = async (req, res) => {
  let success = false;
  let quizID = req.params.quizID;
  let user = req.user;
  try {
    let quiz = await Quiz.findOne({ quizID: quizID });
    if (!quiz) {
      return res.json({ success, error: "Quiz Not Found!" });
    }

    user = await User.findOne({ _id: user.id });
    if (!user) {
      return res.json({ success, error: "User Not Found!" });
    }

    if (quiz.user.toString() !== user.id.toString()) {
      return res.json({
        success,
        error: "You are not authorized to delete this quiz!",
      });
    }

    let questions = quiz.questions;
    for (let i = 0; i < questions.length; i++) {
      let question = questions[i];
      let ques = await Question.findOne({ _id: question });
      if (!ques) {
        return res.json({ success, error: "Question Not Found!" });
      }
      await ques.deleteOne();
    }

    await quiz.deleteOne();

    user.quizCreated = user.quizCreated - 1;
    user.questionsCreated = user.questionsCreated - questions.length;
    user.totalImpressions = user.totalImpressions - quiz.impressions;
    await user.save();

    success = true;
    return res.json({ success, info: "Quiz Deleted Successfully!!" });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Something Went Wrong!" });
  }
};

const getTrending = async (req, res) => {
  let success = false;
  let user = req.user;
  try {
    let quizzes = await Quiz.find(
      { user: user.id },
      "impressions createdOn name"
    ).sort({ impressions: -1 });
    quizzes = quizzes.filter((quiz, index) => quiz.impressions > 10);
    success = true;
    return res.json({ success, quizzes });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Something Went Wrong!" });
  }
};

const getQuestion = async (req, res) => {
  const { questionID } = req.params;

  try {
    const question = await Question.findOne({ _id: questionID });
    if (!question) {
      return res.json({ error: "Question Not Found!" });
    }

    return res.json({ success: true, question });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Something Went Wrong!" });
  }
};

const getAllQuestions = async (req, res) => {
  let success = false;
  const { email, regNo } = req.body;

  let emailData = await Emails.findOne({ email });
  if (!emailData) {
    return res.json({ success: false, error: "Email Not Found!" });
  }

  let quizStatus = emailData.quizStatus;
  let quizId = emailData.quizID;
  let attemptNumber = emailData.attemptNumber;

  if (attemptNumber > 3) {
    return res.json({ success: false, error: "You have already attempted the quiz more than 3 times! Contact Admin if you want to attempt again." });
  }

  if (quizStatus === "completed") {
    return res.json({ success: false, error: "You have already completed the quiz!" });
  }

  let questions = await Question.find({}, "-correctAnswer");
  // filter out and send 5 questions with timer each 30, 60, 90
  let easyQuestions = questions.filter((question) => question.timer === 30);
  let medQuestions = questions.filter((question) => question.timer === 60);
  let hardQuestions = questions.filter((question) => question.timer === 90);
  easyQuestions = easyQuestions.sort(() => Math.random() - 0.5);
  medQuestions = medQuestions.sort(() => Math.random() - 0.5);
  hardQuestions = hardQuestions.sort(() => Math.random() - 0.5);
  easyQuestions = easyQuestions.slice(0, 5);
  medQuestions = medQuestions.slice(0, 5);
  hardQuestions = hardQuestions.slice(0, 5);
  let randomQuestions = [...easyQuestions, ...medQuestions, ...hardQuestions];

  if (quizStatus === "started") {
    emailData.attemptNumber = emailData.attemptNumber + 1;
    await emailData.save();
    // return previous questions
    let questions = randomQuestions;
    // for each question reduce timer by 10
    questions = questions.map((question) => {
      question.timer = Math.max(0, question.timer - emailData.attemptNumber * 5);
      if (question.timer < 0) question.timer = 0;
      if (question.timer > 0) return question;
      else return null;
    });
     // filter out null questions
     questions = questions.filter((question) => question !== null);
     return res.json({ success: true, questions, quizId });
   }
 
 

  emailData.quizQuestions = randomQuestions.map((question) => question._id);
  emailData.quizStatus = "started";
  emailData.attemptNumber = emailData.attemptNumber + 1;
  await emailData.save();
  
  success = true;
  return res.json({ success, questions: randomQuestions });
};


module.exports = {
  createQuiz,
  getQuiz,
  takeQuiz,
  check_attempt,
  save_score,
  deleteQuiz,
  takePoll,
  getTrending,
  getQuestion,
  getAllQuestions
};
