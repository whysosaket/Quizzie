import React, { useContext, useState, useEffect } from "react";
import QuizContext from "../../context/QuizContext";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const delimeter = "@1&2^";

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
    // console.log(takeQuizInfo);
    // console.log("SEPERSTOR");
    // console.log(takeQuizQuestions);
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
      //console.log(result);
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
    // const regNoRegex = /^\d{10}$/;
    // if (!regNo || !regNoRegex.test(regNo)) {
    //   toast("Please enter a valid 10-digit registration number.");
    //   return;
    // }

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

    let finalAnswers = [];
    for (let i = 0; i < takeQuizInfo.quesRandom.length; i++) {
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
  return (
    <>
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

          <h2 className="question">
            {takeQuizQuestions[questionNumber] && (
              <pre>{takeQuizQuestions[questionNumber].question}</pre>
            )}
          </h2>

          {takeQuizQuestions[questionNumber] &&
            takeQuizQuestions[questionNumber].optionType === "text" && (
              <div className="options">
                <div
                  onClick={() => handleSelected(0)}
                  className={`option ${selected === 0 && "selected"}`}
                >
                  {takeQuizQuestions[questionNumber].options[0]}
                </div>
                <div
                  onClick={() => handleSelected(1)}
                  className={`option ${selected === 1 && "selected"}`}
                >
                  {takeQuizQuestions[questionNumber].options[1]}
                </div>
                {takeQuizQuestions[questionNumber].options[2] && (
                  <div
                    onClick={() => handleSelected(2)}
                    className={`option ${selected === 2 && "selected"}`}
                  >
                    {takeQuizQuestions[questionNumber].options[2]}
                  </div>
                )}
                {takeQuizQuestions[questionNumber].options[3] && (
                  <div
                    onClick={() => handleSelected(3)}
                    className={`option ${selected === 3 && "selected"}`}
                  >
                    {takeQuizQuestions[questionNumber].options[3]}
                  </div>
                )}
              </div>
            )}

          {takeQuizQuestions[questionNumber] &&
            takeQuizQuestions[questionNumber].optionType === "img" && (
              <div className="options">
                <div
                  onClick={() => handleSelected(0)}
                  className={`option ${selected === 0 && "selected"}`}
                >
                  <img
                    src={takeQuizQuestions[questionNumber].imageOptions[0]}
                    alt="option1"
                  />
                </div>
                <div
                  onClick={() => handleSelected(1)}
                  className={`option ${selected === 1 && "selected"}`}
                >
                  <img
                    src={takeQuizQuestions[questionNumber].imageOptions[1]}
                    alt="option2"
                  />
                </div>
                {takeQuizQuestions[questionNumber].imageOptions[2] && (
                  <div
                    onClick={() => handleSelected(2)}
                    className={`option ${selected === 2 && "selected"}`}
                  >
                    <img
                      src={takeQuizQuestions[questionNumber].imageOptions[2]}
                      alt="option3"
                    />
                  </div>
                )}
                {takeQuizQuestions[questionNumber].imageOptions[3] && (
                  <div
                    onClick={() => handleSelected(3)}
                    className={`option ${selected === 3 && "selected"}`}
                  >
                    <img
                      src={takeQuizQuestions[questionNumber].imageOptions[3]}
                      alt="option4"
                    />
                  </div>
                )}
              </div>
            )}

          {takeQuizQuestions[questionNumber] &&
            takeQuizQuestions[questionNumber].optionType === "both" && (
              <div className="options">
                <div
                  onClick={() => handleSelected(0)}
                  className={`option both ${selected === 0 && "selected"}`}
                >
                  {takeQuizQuestions[questionNumber].options[0]}
                  <img
                    src={takeQuizQuestions[questionNumber].imageOptions[0]}
                    alt="option1"
                  />
                </div>
                <div
                  onClick={() => handleSelected(1)}
                  className={`option both ${selected === 1 && "selected"}`}
                >
                  {takeQuizQuestions[questionNumber].options[1]}
                  <img
                    src={takeQuizQuestions[questionNumber].imageOptions[1]}
                    alt="option2"
                  />
                </div>
                {takeQuizQuestions[questionNumber].imageOptions[2] && (
                  <div
                    onClick={() => handleSelected(2)}
                    className={`option both ${selected === 2 && "selected"}`}
                  >
                    {takeQuizQuestions[questionNumber].options[2]}
                    <img
                      src={takeQuizQuestions[questionNumber].imageOptions[2]}
                      alt="option3"
                    />
                  </div>
                )}
                {takeQuizQuestions[questionNumber].imageOptions[3] && (
                  <div
                    onClick={() => handleSelected(3)}
                    className={`option both ${selected === 3 && "selected"}`}
                  >
                    {takeQuizQuestions[questionNumber].options[3]}
                    <img
                      src={takeQuizQuestions[questionNumber].imageOptions[3]}
                      alt="option4"
                    />
                  </div>
                )}
              </div>
            )}

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
        <div className="questions startquiz">
          <h1
            style={{
              fontSize: "2rem",
              color: "#1a73e8",
              fontWeight: "bold",
            }}
          >
            {takeQuizInfo.name}
          </h1>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            pattern="^[a-zA-Z0-9._%+-]+@gmail\.com$"
            title="Please enter a valid Gmail address."
            style={{
              width: "100%",
              padding: "10px 15px",
              fontSize: "1rem",
              border: "2px solid #ddd",
              borderRadius: "8px",
              boxSizing: "border-box",
              marginBottom: "10px",
            }}
            required
          />

          <input
            type=""
            placeholder="Enter your registration number"
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
            maxLength={10}
            pattern="^\d{10}$"
            title="Registration number must be 10 digits"
            style={{
              width: "100%",
              padding: "10px 15px",
              fontSize: "1rem",
              border: "2px solid #ddd",
              borderRadius: "8px",
              boxSizing: "border-box",
              marginBottom: "20px",
            }}
            required
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
