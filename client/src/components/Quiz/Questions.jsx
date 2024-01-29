import React, { useContext, useState, useEffect } from "react";
import QuizContext from "../../context/QuizContext";
import {useLocation} from 'react-router-dom'

const delimeter = "@1&2^";

const Questions = () => {
  const location = useLocation();
  const { getQuiz, takeQuiz, takeQuizQuestions, takeQuizInfo } = useContext(QuizContext);

  const [quiz, setQuiz] = useState();
  const [questionNumber, setQuestionNumber] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timer, setTimer] = useState(0);
  const [selected, setSelected] = useState(-1);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    getQuiz(location.pathname.split("/")[2]);
  }, []);

  useEffect(() => {
    let countdown;
    console.log(takeQuizQuestions[questionNumber]);

    if(takeQuizQuestions[questionNumber] && takeQuizQuestions[questionNumber].timer === 0){
        return () => clearInterval(countdown);
    }

    if (isStarted && timer >= 0) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (isStarted && timer === -1 && questionNumber < takeQuizInfo.questions.length - 1) {
        setTimer(takeQuizQuestions[questionNumber+1].timer);
        handleNext();
    }else if(isStarted && timer === -1 && questionNumber === takeQuizInfo.questions.length - 1){
        // takeQuiz(takeQuizInfo.quizID, answers);
        let newAnswers = [...answers];
        newAnswers.push(selected);
        let finalAnswers = [];
        for(let i=0; i<takeQuizInfo.questions.length; i++){
            let ans = "";
            if(takeQuizQuestions[i].optionType === "text"){
                ans += takeQuizQuestions[i].options[newAnswers[i]];
                ans += delimeter;
            }
            else if(takeQuizQuestions[i].optionType === "img"){
                ans += delimeter;
                ans += takeQuizQuestions[i].imageOptions[newAnswers[i]];
            }else if(takeQuizQuestions[i].optionType === "both"){
                ans += takeQuizQuestions[i].options[newAnswers[i]];
                ans += delimeter;
                ans += takeQuizQuestions[i].imageOptions[newAnswers[i]];
            }
            finalAnswers.push(ans);
        }

        // takeQuiz(takeQuizInfo.quizID, finalAnswers);
        console.log(finalAnswers);
    }

    return () => clearInterval(countdown);
  }, [isStarted, timer, questionNumber]);

  const startQuiz = async () => {
    setTimer(takeQuizQuestions[0].timer);
    console.log(takeQuizQuestions[0].timer);
    setIsStarted(true);
  }

  const handleSelected = (index) => {
    setSelected(index);
  }

  const handleNext = () => {
    const newAnswers = [...answers];
    newAnswers.push(selected);
    setAnswers(newAnswers);
    setSelected(-1);
    setQuestionNumber(questionNumber+1);
    setTimer(takeQuizQuestions[questionNumber+1].timer);
  }


  return (
   <>
    {
        isStarted ?  <div className="questions">
        <div className="qtopbar">
          <h2 className="questionno">0{questionNumber+1}/0{takeQuizInfo.questions.length}</h2>
          {takeQuizInfo.type === "qna" && takeQuizQuestions[questionNumber]&& takeQuizQuestions[questionNumber].timer>0&&
          <h2 className="timer">00:{timer<10&&0}{timer}s</h2>}
        </div>
        <h2 className="question">
          {takeQuizQuestions[questionNumber]&&takeQuizQuestions[questionNumber].question}
        </h2>
        {
          takeQuizQuestions[questionNumber]&& takeQuizQuestions[questionNumber].optionType === "text" &&
          <div className="options">
              <div onClick={()=> handleSelected(0)} className={`option ${selected===0&&"selected"}`}>{takeQuizQuestions[questionNumber].options[0]}</div>
              <div onClick={()=> handleSelected(1)} className={`option ${selected===1&&"selected"}`}>{takeQuizQuestions[questionNumber].options[1]}</div>
              {takeQuizQuestions[questionNumber].options[2] &&
              <div onClick={()=> handleSelected(2)} className={`option ${selected===2&&"selected"}`}>{takeQuizQuestions[questionNumber].options[2]}</div>}
              {takeQuizQuestions[questionNumber].options[3] &&
              <div onClick={()=> handleSelected(3)} className={`option ${selected===3&&"selected"}`}>{takeQuizQuestions[questionNumber].options[3]}</div>}
          </div>
  
        }
        <div className="submit">
          {
              questionNumber < takeQuizInfo.questions.length - 1?<div onClick={handleNext} className="submitbtn">Next</div>:<div className="submitbtn">Submit</div>
          }
        </div>
      </div>:<div className="questions startquiz">
        <h1 className="question"> {takeQuizInfo.name}</h1>
          <button onClick={startQuiz} className="submitbtn startquizbtn">Start Quiz</button>
      </div>
    }
   </>
  );
};

export default Questions;
