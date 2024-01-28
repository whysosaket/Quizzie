import React from "react";

const PollBox = (props) => {
  const { question } = props;
  return (
    <>
      <div className="boxes">
        <div className="box poll">
          <h1>{question.optedOption1}</h1>
          <h3>{question.options[0]}</h3>
        </div>
        <div className="box poll">
          <h1>{question.optedOption2}</h1>
          <h3>{question.options[1]}</h3>
        </div>
        {question.options.length>=3 &&
        <div className="box poll">
          <h1>{question.optedOption3}</h1>
          <h3>{question.options[2]}</h3>
        </div>}
        {question.options.length>=4 &&
        <div className="box poll">
          <h1>{question.optedOption4}</h1>
          <h3>{question.options[3]}</h3>
        </div>}
      </div>
    </>
  );
};

export default PollBox;
