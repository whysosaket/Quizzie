import React from "react";
import { FiPlus } from "react-icons/fi";

const questions = ["question1", "question2", "question3"];

const options = ["option1", "option2", "s"];

const QuizModalPage2 = (props) => {
    const {setShowModal} = props;
  return (
    <div className="page page2">
    {/* <div className="page page2 poll"> */}
      <div className="topbar">
        <div className="topbarleft">
          {questions.map((question, index) => {
            return (
              <div key={index} className="questionselector">
                <h6>{index + 1}</h6>
              </div>
            );
          })}
          <div className="questionselector">
            <FiPlus />
          </div>
        </div>
        <h6>Max 5 questions</h6>
      </div>
      <div className="question">
        <input type="text" placeholder="Poll Question" />
      </div>
      <div className="questiontype">
        <p>Question Type</p>
        <div className="questiontypebtns">
          <label>
            <input
              type="radio"
              name="questionType"
              className="btnopt"
              value="text"
            />
            Text
          </label>
          <label>
            <input
              type="radio"
              name="questionType"
              className="btnopt"
              value="imageUrl"
            />
            Image URL
          </label>
          <label>
            <input
              type="radio"
              name="questionType"
              className="btnopt"
              value="textAndImageUrl"
            />
            Text & Image URL
          </label>
        </div>
      </div>
      <div className="bottombar">
        <div className="bottomleft">
          {options.map((option, index) => {
            return (
              <label key={index}>
                <input
                  type="radio"
                  name="option"
                  className="btnopt "
                  value="text"
                />
                <input className={`${index==1&&"selected"}`} type="text" placeholder="Text" />
                <input className={`${index==1&&"selected"} imageoption`} type="text" placeholder="Image URL" />
              </label>
            );
          })}

                <div className="addoption">
                    Add Option
                </div>
        </div>
        <div className="bottomright">
          <div className="timeroptions">
            <h6>Timer</h6>
            <div className="timer">OFF</div>
            <div className="timer">5 sec</div>
            <div className="timer selected">10 sec</div>
          </div>
        </div>
      </div>
      <div className="cancelconfirm">
        <button onClick={()=>setShowModal(false)} className="cancelbtn">Cancel</button>
        <button className="confirmbtn">Create Quiz</button>
      </div>
    </div>
  );
};

export default QuizModalPage2;
