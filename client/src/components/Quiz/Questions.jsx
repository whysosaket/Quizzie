import React, { useContext, useState, useEffect } from "react";
import QuizContext from "../../context/QuizContext";
import { useLocation } from "react-router-dom";

const delimeter = "@1&2^";

const Questions = (props) => {
  const location = useLocation();
  const { getQuiz, takeQuiz, takePoll, takeQuizQuestions, takeQuizInfo } =
    useContext(QuizContext);
  const { setIsFinished } = props;

  const [email, setEmail] = useState("");
  const [regNo, setRegNo] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timer, setTimer] = useState(0);
  const [selected, setSelected] = useState(-1);

  useEffect(() => {
    getQuiz(location.pathname.split("/")[2]);
  }, []);

  useEffect(() => {
    let countdown;

    if (
      takeQuizQuestions[questionNumber] &&
      takeQuizQuestions[questionNumber].timer === 0
    ) {
      return () => clearInterval(countdown);
    }

    if (isStarted && timer >= 0) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (
      isStarted &&
      timer === -1 &&
      questionNumber < takeQuizInfo.questions.length - 1
    ) {
      setTimer(takeQuizQuestions[questionNumber + 1].timer);
      handleNext();
    } else if (
      isStarted &&
      timer === -1 &&
      questionNumber === takeQuizInfo.questions.length - 1
    ) {
      handleFinish();
    }

    return () => clearInterval(countdown);
  }, [isStarted, timer, questionNumber]);

  const startQuiz = async () => {
    if (!email || !regNo) {
      alert(
        "Please enter both email and registration number to start the quiz."
      );
      return;
    }
    setTimer(takeQuizQuestions[0].timer);
    setIsStarted(true);
  };

  const handleSelected = (index) => {
    setSelected(index);
  };

  const handleNext = () => {
    const newAnswers = [...answers];
    newAnswers.push(selected);
    setAnswers(newAnswers);
    setSelected(-1);
    setQuestionNumber(questionNumber + 1);
    setTimer(takeQuizQuestions[questionNumber + 1].timer);
  };

  const handleFinish = async () => {
    let newAnswers = [...answers];
    newAnswers.push(selected);
    let finalAnswers = [];
    for (let i = 0; i < takeQuizInfo.questions.length; i++) {
      let ans = "";
      if (takeQuizQuestions[i].optionType === "text") {
        ans += takeQuizQuestions[i].options[newAnswers[i]];
        ans += delimeter;
      } else if (takeQuizQuestions[i].optionType === "img") {
        ans += delimeter;
        ans += takeQuizQuestions[i].imageOptions[newAnswers[i]];
      } else if (takeQuizQuestions[i].optionType === "both") {
        ans += takeQuizQuestions[i].options[newAnswers[i]];
        ans += delimeter;
        ans += takeQuizQuestions[i].imageOptions[newAnswers[i]];
      }
      finalAnswers.push(ans);
    }

    const quizData = {
      email,
      regNo,
      quizID: takeQuizInfo.quizID,
      answers: finalAnswers,
    };

    if (takeQuizInfo.type === "poll") {
      await takePoll(takeQuizInfo.quizID, finalAnswers);
      setIsFinished(true);
      return;
    }
    await takeQuiz(quizData);
    setIsFinished(true);
  };

  return (
    <>
      {isStarted ? (
        <div className="questions">
          <div className="qtopbar">
            <h2 className="questionno">
              0{questionNumber + 1}/0{takeQuizInfo.questions.length}
            </h2>
            {takeQuizInfo.type === "qna" &&
              takeQuizQuestions[questionNumber] &&
              takeQuizQuestions[questionNumber].timer > 0 && (
                <h2 className="timer">
                  00:{timer < 10 && 0}
                  {timer}s
                </h2>
              )}
          </div>
          <h2 className="question">
            {takeQuizQuestions[questionNumber] &&
              takeQuizQuestions[questionNumber].question}
          </h2>
          {/* Render options */}
          <div className="submit">
            {questionNumber < takeQuizInfo.questions.length - 1 ? (
              <div onClick={handleNext} className="submitbtn">
                Next
              </div>
            ) : (
              <div onClick={handleFinish} className="submitbtn">
                Submit
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="questions startquiz">
          <h1
            style={{ fontSize: "2rem", color: "#1a73e8", fontWeight: "bold" }}
          >
            {takeQuizInfo.name}
          </h1>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 15px",
              fontSize: "1rem",
              border: "2px solid #ddd",
              borderRadius: "8px",
              boxSizing: "border-box",
              marginBottom: "10px",
            }}
          />
          <input
            type="text"
            placeholder="Enter your registration number"
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 15px",
              fontSize: "1rem",
              border: "2px solid #ddd",
              borderRadius: "8px",
              boxSizing: "border-box",
              marginBottom: "20px",
            }}
          />
          <button
            onClick={startQuiz}
            style={{
              width: "100%",
              padding: "12px 15px",
              fontSize: "1.2rem",
              color: "white",
              backgroundColor: "green",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              boxSizing: "border-box",
              fontWeight: "bold",
            }}
          >
            Start Quiz
          </button>
        </div>
      )}
    </>
  );
};

export default Questions;
