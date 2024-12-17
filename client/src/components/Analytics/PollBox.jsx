import React from "react";

const PollBox = (props) => {
  const { question } = props;
  const {optionType} = question;
  return (
    <>
      <div className="boxes">
        <div className="box poll">
          <h1>{question.optedOption1}</h1>
          <h3>{optionType==="text"?question.options[0]:"Option 1"}</h3>
        </div>
        <div className="box poll">
          <h1>{question.optedOption2}</h1>
          <h3>{optionType==="text"?question.options[1]:"Option 2"}</h3>
        </div>
        {question.options[2] &&
        <div className="box poll">
          <h1>{question.optedOption3}</h1>
          <h3>{optionType==="text"?question.options[2]:"Option 3"}</h3>
        </div>}
        {question.options[2] &&
        <div className="box poll">
          <h1>{question.optedOption4}</h1>
          <h3>{optionType==="text"?question.options[3]:"Option 4"}</h3>
        </div>}
      </div>
    </>
  );
};

export default PollBox;
