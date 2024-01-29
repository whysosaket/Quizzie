import React, {useState, useContext} from "react";
import Image from "../../assets/cong.png";
import QuizContext from "../../context/QuizContext";

const Congratulations = () => {
  const {result} = useContext(QuizContext);
  return (
    <div className="quizcompleted">
      {result.total<=0 ? (
        <h1 className="thankyou">Thank you for participating in the Poll</h1>
      ) : (
        <>
          <h1>Congrats Quiz is completed</h1>
          <img src={Image} alt="cong" />
          <h1>
            Your score is <span className="score">0{result.score}/0{result.total}</span>
          </h1>
        </>
      )}
    </div>
  );
};

export default Congratulations;
