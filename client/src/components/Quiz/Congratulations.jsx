import React, { useState, useContext } from "react";
import Image from "../../assets/cong.png";
import QuizContext from "../../context/QuizContext";

const Congratulations = () => {
  const { result } = useContext(QuizContext);
  return (
    <div className="quizcompleted">
      {
        <>
          <h1 className="thankyou">Thank you for participating in the Quiz</h1>
          <img src={Image} alt="cong" />
        </>
      }
    </div>
  );
};

export default Congratulations;
