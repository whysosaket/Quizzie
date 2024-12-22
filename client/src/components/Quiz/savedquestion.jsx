import React, { useContext, useState, useEffect } from "react";
import QuizContext from "../../context/QuizContext";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const Questions = (props) => {
  let url = import.meta.env.VITE_URL || "http://localhost:9000";
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
  const [questionTimers, setQuestionTimers] = useState([]);

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
      questionNumber < takeQuizInfo.quesRandom.length - 1
    ) {
      setTimer(takeQuizQuestions[questionNumber + 1].timer);
      handleNext();
    } else if (
      isStarted &&
      timer === -1 &&
      questionNumber === takeQuizInfo.quesRandom.length - 1
    ) {
      handleFinish();
    }

    return () => clearInterval(countdown);
  }, [isStarted, timer, questionNumber]);

  const checkIfAttempted = async (email, regNo) => {
    try {
      const response = await fetch(
        `${url}/api/quiz/check_attempt?email=${encodeURIComponent(
          email
        )}&regNo=${encodeURIComponent(regNo)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      return { success: result.success, message: result.message };
    } catch (error) {
      console.error("Error in checkIfAttempted:", error);
      throw error;
    }
  };

  const startQuiz = async () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!email || !emailRegex.test(email)) {
      toast("Please enter a valid Gmail address.");
      return;
    }
    const { success, message } = await checkIfAttempted(email, regNo);
    if (success) {
      toast(message);
      return;
    }
    setQuestionTimers(Array(takeQuizQuestions.length).fill(0));
    setTimer(takeQuizQuestions[0].timer);
    setIsStarted(true);
  };

  const handleSelected = (index) => {
    setSelected(index);
  };

  const handleNext = () => {
    const newAnswers = [...answers];
    newAnswers.push(selected);
    const newTimers = [...questionTimers];
    newTimers[questionNumber] = takeQuizQuestions[questionNumber].timer - timer;

    setAnswers(newAnswers);
    setQuestionTimers(newTimers);
    setSelected(-1);
    setQuestionNumber(questionNumber + 1);
    setTimer(takeQuizQuestions[questionNumber + 1].timer);
  };

  const handleFinish = async () => {
    let newAnswers = [...answers];
    newAnswers.push(selected);
    const newTimers = [...questionTimers];
    newTimers[questionNumber] = takeQuizQuestions[questionNumber].timer - timer;

    let finalAnswers = takeQuizQuestions.map((q, i) => {
      if (q.optionType === "text") {
        return q.options[newAnswers[i]] + delimeter;
      } else if (q.optionType === "img") {
        return delimeter + q.imageOptions[newAnswers[i]];
      } else if (q.optionType === "both") {
        return (
          q.options[newAnswers[i]] + delimeter + q.imageOptions[newAnswers[i]]
        );
      }
      return "";
    });

    const quizData = {
      email,
      regNo,
      quizID: takeQuizInfo.quizID,
      answers: finalAnswers,
      questionTimers: newTimers,
    };

    if (takeQuizInfo.type === "poll") {
      await takePoll(takeQuizInfo.quizID, finalAnswers);
      setIsFinished(true);
      return;
    }
    await takeQuiz(quizData);
    setIsFinished(true);
  };

  // here is the actual quiz part
  return (
    <div className="quizcontainer"> {/* Added the quizcontainer class here */}
      {isStarted ? (
        <div className="questions">
          <div className="qtopbar">
            <h2 className="questionno">
              0{questionNumber + 1}/0{takeQuizInfo.quesRandom.length}
            </h2>
            {takeQuizInfo.type === "qna" &&
              takeQuizQuestions[questionNumber] &&
              takeQuizQuestions[questionNumber].timer > 0 && (
                <h2 className="timer">
                  00:{timer < 10 ? "0" : ""} {timer}s
                </h2>
              )}
          </div>
          <div className="question-container">
            <h2 className="question">
              {takeQuizQuestions[questionNumber] && (
                <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                  {takeQuizQuestions[questionNumber].question}
                </pre>
              )}
            </h2>
          </div>

          {/* Options: text, image, or both */}
          <div className="options">
            {takeQuizQuestions[questionNumber]?.options?.map((option, i) => (
              <div
                key={i}
                onClick={() => handleSelected(i)}
                className={`option ${selected === i ? "selected" : ""}`}
              >
                {option}
                {takeQuizQuestions[questionNumber]?.imageOptions?.[i] && (
                  <img
                    src={takeQuizQuestions[questionNumber]?.imageOptions[i]}
                    alt={`option-${i}`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="submit">
            {questionNumber < takeQuizInfo.quesRandom.length - 1 ? (
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
        <div className="login startquiz glass-effect-container">
          <h1 style={{ fontSize: "2rem", color: "#5789fg", fontWeight: "bold" }}>
            {takeQuizInfo.name} start
          </h1>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />

          <input
            type="text"
            placeholder="Enter your registration number"
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
            maxLength={10}
            style={inputStyle}
            required
          />

          <button onClick={startQuiz} style={buttonStyle}>
            Start Quiz
          </button>
        </div>
      )}
    </div>
  );
};

// Input and button styles for responsiveness
const inputStyle = {
  width: "100%",
  padding: "10px 15px",
  fontSize: "1rem",
  border: "2px solid #ddd",
  borderRadius: "8px",
  boxSizing: "border-box",
  marginBottom: "10px",
};

const buttonStyle = {
  width: "100%",
  padding: "12px 15px",
  fontSize: "1.2rem",
  color: "white",
  backgroundColor: "green",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

export default Questions;

// to d if question is too big then its starting part is not commming also the timer is not showing