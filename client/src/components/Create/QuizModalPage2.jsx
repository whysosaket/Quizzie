import React, {useContext, useRef} from "react";
import { FiPlus } from "react-icons/fi";
import GlobalContext from '../../context/GlobalContext';
import QuizContext from '../../context/QuizContext';

const questions = ["ss"];

const options = ["option1", "option2"];

const QuizModalPage2 = (props) => {
    const {setShowModal} = props;
    const {toastMessage} = useContext(GlobalContext);
    const {setCleanup, createQuestion} = useContext(QuizContext);

    const questionRef = useRef();
    const optionTypeRef = useRef();
    const option1Ref = useRef();
    const option2Ref = useRef();
    const option3Ref = useRef();
    const option4Ref = useRef();
    const option1ImgRef = useRef();
    const option2ImgRef = useRef();
    const option3ImgRef = useRef();
    const option4ImgRef = useRef();
    const timerRef = useRef();


    const handleCleanup = () => {
        setShowModal(false);
        setCleanup();
    }

    const handleCreate = () => {

        const question = questionRef.current.value;
        const optionType = optionTypeRef.current;

        console.log(optionType);
        console.log(question);
    }

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
        <input ref={questionRef} type="text" placeholder="Poll Question" />
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
              ref={optionTypeRef}
            />
            Text
          </label>
          <label>
            <input
              type="radio"
              name="questionType"
              className="btnopt"
              value="imageUrl"
              ref={optionTypeRef}
            />
            Image URL
          </label>
          <label>
            <input
              type="radio"
              name="questionType"
              className="btnopt"
              value="textAndImageUrl"
              ref={optionTypeRef}
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
        <button onClick={handleCleanup} className="cancelbtn">Cancel</button>
        <button onClick={handleCreate} className="confirmbtn">Create Quiz</button>
      </div>
    </div>
  );
};

export default QuizModalPage2;
