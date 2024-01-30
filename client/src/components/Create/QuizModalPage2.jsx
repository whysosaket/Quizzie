import React, { useContext, useRef, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { RiDeleteBin6Fill } from "react-icons/ri";
import GlobalContext from "../../context/GlobalContext";
import QuizContext from "../../context/QuizContext";

const QuizModalPage2 = (props) => {
  const { setShowModal, setCurrentPage } = props;
  const { toastMessage } = useContext(GlobalContext);
  const { cleanUp, createQuestion, quizInfo, questions, deleteQuestion, createQuiz } =
    useContext(QuizContext);

  const [questionType, setQuestionType] = useState("text");
  const [selectedOption, setSelectedOption] = useState(-1);
  const [selectedTimer, setSelectedTimer] = useState("0");
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [questionNumber, setQuestionNumber] = useState([0]);
  const [options, setOptions] = useState([0, 1]);

  const handleCleanup = () => {
    setShowModal(false);
    cleanUp();
  };

  const questionRef = useRef();
  const optionRef = [useRef(), useRef(), useRef(), useRef()];
  const optionImgRef = [useRef(), useRef(), useRef(), useRef()];

  const handleAddOption = () => {
    if (options.length > 3) {
      toastMessage("Max 4 options allowed", "warning");
      return;
    }
    setOptions([...options, options.length]);
  };

  const handleDeleteOption = (index) => {
    if (index === 2 && options.length > 3) {
      if (optionRef[2].current)
        optionRef[2].current.value = optionRef[3].current.value;
      if (optionImgRef[2].current)
        optionImgRef[2].current.value = optionImgRef[3].current.value;
    }

    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);

    if (selectedOption === index) {
      setSelectedOption(0);
    }

    if (selectedOption > index) {
      setSelectedOption(selectedOption - 1);
    }

    optionRef.splice(index, 1);
    optionImgRef.splice(index, 1);

    if (index >= 1) {
      optionRef[index - 1].current.focus();
    }

    handleSoftChange();
  };

  const handleAddQuestion = () => {
    let ans = saveChanges();
    if (!ans) return;

    if (questionNumber.length > 4) {
      toastMessage("Max 5 questions allowed", "warning");
      return;
    }

    const newQuestionNumber = [...questionNumber];
    newQuestionNumber.push(questionNumber.length);
    setQuestionNumber(newQuestionNumber);
    setSelectedQuestion(questionNumber.length);
    setSelectedOption(-1);
    setQuestionType("text");
    setSelectedTimer("0");
    setOptions([0, 1]);

    questionRef.current.value = "";
    optionRef[0].current.value = "";
    optionRef[1].current.value = "";
  };

  const saveChanges = () => {
    const question = questionRef.current.value;
    if (!question) {
      toastMessage("Please enter a question", "warning");
      return;
    }

    if (quizInfo.type ==="qna" && selectedOption === -1) {
      toastMessage("Please select an option", "warning");
      return;
    }

    let option1,
      option2,
      option3,
      option4,
      option1img,
      option2img,
      option3img,
      option4img;

    if (optionRef[0].current) {
      if (!optionRef[0].current.value) {
        toastMessage("Please enter option 1", "warning");
        return;
      }
      option1 = optionRef[0].current.value;
    }

    if (optionRef[1].current) {
      if (!optionRef[1].current.value) {
        toastMessage("Please enter option 2", "warning");
        return;
      }
      option2 = optionRef[1].current.value;
      if(option2 === option1){
        toastMessage("Please enter different options", "warning");
        return;
      }
    }

    if (optionRef[2].current) {
      if (!optionRef[2].current.value) {
        toastMessage("Please enter option 3", "warning");
        return;
      }
      option3 = optionRef[2].current.value;
        if(option3 === option1 || option3 === option2){
            toastMessage("Please enter different options", "warning");
            return;
        }
    }

    if (optionRef[3].current) {
      if (!optionRef[3].current.value) {
        toastMessage("Please enter option 4", "warning");
        return;
      }
      option4 = optionRef[3].current.value;
        if(option4 === option1 || option4 === option2 || option4 === option3){
            toastMessage("Please enter different options", "warning");
            return;
        }
    }

    if (optionImgRef[0].current) {
      if (!optionImgRef[0].current.value) {
        toastMessage("Please enter option 1 image URL", "warning");
        return;
      }
      option1img = optionImgRef[0].current.value;
    }

    if (optionImgRef[1].current) {
      if (!optionImgRef[1].current.value) {
        toastMessage("Please enter option 2 image URL", "warning");
        return;
      }
      option2img = optionImgRef[1].current.value;
      if(option2img === option1img){
        toastMessage("Please enter different options", "warning");
        return;
      }
    }

    if (optionImgRef[2].current) {
      if (!optionImgRef[2].current.value) {
        toastMessage("Please enter option 3 image URL", "warning");
        return;
      }
      option3img = optionImgRef[2].current.value;
        if(option3img === option1img || option3img === option2img){
            toastMessage("Please enter different options", "warning");
            return;
        }
    }

    if (optionImgRef[3].current) {
      if (!optionImgRef[3].current.value) {
        toastMessage("Please enter option 4 image URL", "warning");
        return;
      }
      option4img = optionImgRef[3].current.value;
        if(option4img === option1img || option4img === option2img || option4img === option3img){
            toastMessage("Please enter different options", "warning");
            return;
        }
    }

    let optionType = questionType;
    if (questionType === "text") optionType = "text";
    else if (questionType === "imageUrl") optionType = "img";
    else if (questionType === "textAndImageUrl") optionType = "both";
    const timer = selectedTimer;

    let correctAnswer = "";
    if (selectedOption === 0) {
      if (optionRef[0].current) {
        correctAnswer += optionRef[0].current.value;
      }
      correctAnswer += "@1&2^";
      if (optionImgRef[0].current) {
        correctAnswer += optionImgRef[0].current.value;
      }
    }

    if (selectedOption === 1) {
      if (optionRef[1].current) {
        correctAnswer += optionRef[1].current.value;
      }
      correctAnswer += "@1&2^";
      if (optionImgRef[1].current) {
        correctAnswer += optionImgRef[1].current.value;
      }
    }

    if (selectedOption === 2) {
      if (optionRef[2].current) {
        correctAnswer += optionRef[2].current.value;
      }
      correctAnswer += "@1&2^";
      if (optionImgRef[2].current) {
        correctAnswer += optionImgRef[2].current.value;
      }
    }

    if (selectedOption === 3) {
      if (optionRef[3].current) {
        correctAnswer += optionRef[3].current.value;
      }
      correctAnswer += "@1&2^";
      if (optionImgRef[3].current) {
        correctAnswer += optionImgRef[3].current.value;
      }
    }

    createQuestion(
      selectedQuestion,
      question,
      questionType,
      optionType,
      option1,
      option2,
      option3,
      option4,
      option1img,
      option2img,
      option3img,
      option4img,
      timer,
      correctAnswer
    );
    return true;
  };

  const handleQuestionSelect = (index) => {
    let ans = saveChanges();
    if (!ans) return;

    setSelectedQuestion(index);
    setSelectedOption(-1);
    setQuestionType("text");
    setSelectedTimer("0");
    setOptions([0, 1]);
    populate(index);
  };

  const reset = () => {};

  const populate = async (index) => {
    if (!questions[index].value) reset();

    if (questions[index].optionType === "text") setQuestionType("text");
    else if (questions[index].optionType === "img") setQuestionType("imageUrl");
    else if (questions[index].optionType === "both")
      setQuestionType("textAndImageUrl");

    let ca = questions[index].correctAnswer;
    if (questions[index].optionType === "text") {
      let ans = ca.split("@1&2^");
      if (ans[0] === questions[index].options[0]) setSelectedOption(0);
      else if (ans[0] === questions[index].options[1]) setSelectedOption(1);
      else if (ans[0] === questions[index].options[2]) setSelectedOption(2);
      else if (ans[0] === questions[index].options[3]) setSelectedOption(3);
    } else if (questions[index].optionType === "img") {
      let ans = ca.split("@1&2^");
      if (ans[1] === questions[index].imageOptions[0]) setSelectedOption(0);
      else if (ans[1] === questions[index].imageOptions[1])
        setSelectedOption(1);
      else if (ans[1] === questions[index].imageOptions[2])
        setSelectedOption(2);
      else if (ans[1] === questions[index].imageOptions[3])
        setSelectedOption(3);
    } else if (questions[index].optionType === "both") {
      let ans = ca.split("@1&2^");
      if (
        ans[0] === questions[index].options[0] &&
        ans[1] === questions[index].imageOptions[0]
      )
        setSelectedOption(0);
      else if (
        ans[0] === questions[index].options[1] &&
        ans[1] === questions[index].imageOptions[1]
      )
        setSelectedOption(1);
      else if (
        ans[0] === questions[index].options[2] &&
        ans[1] === questions[index].imageOptions[2]
      )
        setSelectedOption(2);
      else if (
        ans[0] === questions[index].options[3] &&
        ans[1] === questions[index].imageOptions[3]
      )
        setSelectedOption(3);
    }
    setSelectedTimer(questions[index].timer);

    questionRef.current.value = questions[index].question;
    if (questions[index].options[0]) {
      setTimeout(() => {
        optionRef[0].current.value = questions[index].options[0];
      }, 100);
    }
    if (questions[index].options[1]) {
      setTimeout(() => {
        optionRef[1].current.value = questions[index].options[1];
      }, 100);
    }
    if (questions[index].options[2]) {
      setOptions([1, 2, 3]);
      setTimeout(() => {
        optionRef[2].current.value = questions[index].options[2];
      }, 100);
    }
    if (questions[index].options[3]) {
      setOptions([1, 2, 3, 4]);
      setTimeout(() => {
        optionRef[3].current.value = questions[index].options[3];
      }, 100);
    }

    if (questions[index].imageOptions[0]) {
      setTimeout(() => {
        optionImgRef[0].current.value = questions[index].imageOptions[0];
      }, 100);
    }
    if (questions[index].imageOptions[1]) {
      setTimeout(() => {
        optionImgRef[1].current.value = questions[index].imageOptions[1];
      }, 100);
    }
    if (questions[index].imageOptions[2]) {
      setOptions([1, 2, 3]);
      setTimeout(() => {
        optionImgRef[2].current.value = questions[index].imageOptions[2];
      }, 100);
    }
    if (questions[index].imageOptions[3]) {
      setOptions([1, 2, 3, 4]);
      setTimeout(() => {
        optionImgRef[3].current.value = questions[index].imageOptions[3];
      }, 100);
    }
  };

  const handleDeleteQuestion = async (index) => {
    await deleteQuestion(index);
    let newQuestionNumber = [...questionNumber];
    newQuestionNumber = newQuestionNumber.filter((question, i) => i !== index);
    for (let i = index; i < newQuestionNumber.length; i++) {
      newQuestionNumber[i] = i;
    }
    setQuestionNumber(newQuestionNumber);
    setSelectedQuestion(0);
    setSelectedOption(-1);
    setQuestionType("text");
    setSelectedTimer("0");
    setOptions([0, 1]);
    setTimeout(() => {
      populate(0);
    }, 200);
  };

  const handleCreateQuiz = async () => {

    let ans = saveChanges();
    if (!ans) return;

    if (questionNumber.length < 1) {
        toastMessage("Please add at least one question", "warning");
        return;
    }

    setTimeout(async () => {
      ans = await createQuiz();
      if(ans){
          setCurrentPage(2);
      }
    }, 200);
}

const softSaveChanges = () => {
  const question = questionRef.current.value;
  if (!question) {
    return;
  }

  let option1, option2, option3, option4, option1img, option2img, option3img, option4img;

  if (optionRef[0].current) {
    option1 = optionRef[0].current.value;
  }

  if (optionRef[1].current) {
    option2 = optionRef[1].current.value;
  }

  if (optionRef[2].current) {
    option3 = optionRef[2].current.value;
  }

  if (optionRef[3].current) {
    option4 = optionRef[3].current.value;
  }

  if (optionImgRef[0].current) {
    option1img = optionImgRef[0].current.value;
  }

  if (optionImgRef[1].current) {
    option2img = optionImgRef[1].current.value;
  }

  if (optionImgRef[2].current) {
    option3img = optionImgRef[2].current.value;
  }

  if (optionImgRef[3].current) {
    option4img = optionImgRef[3].current.value;
  }

  let optionType = questionType;
  if (questionType === "text") optionType = "text";
  else if (questionType === "imageUrl") optionType = "img";
  else if (questionType === "textAndImageUrl") optionType = "both";
  const timer = selectedTimer;

  let correctAnswer = "";
  if (selectedOption === 0) {
    if (optionRef[0].current) {
      correctAnswer += optionRef[0].current.value;
    }
    correctAnswer += "@1&2^";
    if (optionImgRef[0].current) {
      correctAnswer += optionImgRef[0].current.value;
    }
  }

  if (selectedOption === 1) {
    if (optionRef[1].current) {
      correctAnswer += optionRef[1].current.value;
    }
    correctAnswer += "@1&2^";
    if (optionImgRef[1].current) {
      correctAnswer += optionImgRef[1].current.value;
    }
  }

  if (selectedOption === 2) {
    if (optionRef[2].current) {
      correctAnswer += optionRef[2].current.value;
    }
    correctAnswer += "@1&2^";
    if (optionImgRef[2].current) {
      correctAnswer += optionImgRef[2].current.value;
    }
  }

  if (selectedOption === 3) {
    if (optionRef[3].current) {
      correctAnswer += optionRef[3].current.value;
    }
    correctAnswer += "@1&2^";
    if (optionImgRef[3].current) {
      correctAnswer += optionImgRef[3].current.value;
    }
  }

  createQuestion(
    selectedQuestion,
    question,
    questionType,
    optionType,
    option1,
    option2,
    option3,
    option4,
    option1img,
    option2img,
    option3img,
    option4img,
    timer,
    correctAnswer
  );
};

const handleSoftChange = () => {
  softSaveChanges();
};

const handleSelectOption = (index) => {
  setSelectedOption(index);
  setTimeout(() => {
    softSaveChanges();
  }, 100);
}

const handleSelectTimer = (index) => {
  setSelectedTimer(index);
  setTimeout(() => {
    softSaveChanges();
  }, 100);
}

const handleSelectOptionType = (index) => {
  setQuestionType(index);
  setTimeout(() => {
    softSaveChanges();
  }, 100);
}

  return (
    <div className="page page2">
      <div className="topbar">
        <div className="topbarleft">
          {questionNumber.map((question, index) => {
            return (
              <div
                onClick={() => handleQuestionSelect(index)}
                key={index}
                className={`questionselector ${
                  selectedQuestion === index && "selected"
                }`}
              >
                <h6>{index + 1}</h6>
                {index === questionNumber.length-1 && index > 0 && (
                  <p
                    onClick={() => handleDeleteQuestion(index)}
                    className="cross"
                  >
                    x
                  </p>
                )}
              </div>
            );
          })}
          {questionNumber.length < 5 && (
            <div onClick={handleAddQuestion} className="questionselector">
              <FiPlus />
            </div>
          )}
          {/* <IoSave onClick={saveChanges} className="questionselector saveicon" /> */}
        </div>
        <div>
          <h6>Max 5 questions</h6>
        </div>
      </div>
      <div className="question">
        <input onChange={handleSoftChange} ref={questionRef} type="text" placeholder="Poll Question" />
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
              checked={questionType === "text"}
              onChange={() => handleSelectOptionType("text")}
            />
            Text
          </label>
          <label>
            <input
              type="radio"
              name="questionType"
              className="btnopt"
              value="imageUrl"
              checked={questionType === "imageUrl"}
              onChange={() => handleSelectOptionType("imageUrl")}
            />
            Image URL
          </label>
          <label>
            <input
              type="radio"
              name="questionType"
              className="btnopt"
              value="textAndImageUrl"
              checked={questionType === "textAndImageUrl"}
              onChange={() => handleSelectOptionType("textAndImageUrl")}
            />
            Text & Image URL
          </label>
        </div>
      </div>
      <div className="bottombar">
        <div className="bottomleft">
          {options.map((option, index) => {
            return (
              <div className="optionnnn">
                <label key={index}>
                  { quizInfo.type!=="poll"&&
                  <input
                    type="radio"
                    name="option"
                    className="btnopt"
                    value={option}
                    checked={selectedOption === index}
                    onChange={() => handleSelectOption(index)}
                  />}
                  {(questionType === "text" ||
                    questionType === "textAndImageUrl") && (
                    <input
                      ref={optionRef[index]}
                      className={`${selectedOption === index && "selected"}`}
                      type="text"
                      placeholder="Text"
                      onChange={handleSoftChange}
                    />
                  )}
                  {(questionType === "imageUrl" ||
                    questionType === "textAndImageUrl") && (
                    <input
                      ref={optionImgRef[index]}
                      className={`${
                        selectedOption === index && "selected"
                      } imageoption`}
                      type="text"
                      placeholder="Image URL"
                      onChange={handleSoftChange }
                    />
                  )}
                </label>
                {index > 1 && (
                  <RiDeleteBin6Fill
                    onClick={() => {handleDeleteOption(index);}}
                    className="deleteicon"
                  />
                )}
              </div>
            );
          })}

          {options.length < 4 && (
            <div onClick={handleAddOption} className="addoption">
              Add Option
            </div>
          )}
        </div>
        <div className="bottomright">
          {quizInfo.type!=="poll"&&<div className="timeroptions">
            <h6>Timer</h6>
            <div
              className={`timer ${selectedTimer === "0" && "selected"}`}
              onClick={() => handleSelectTimer("0")}
            >
              OFF
            </div>
            <div
              className={`timer ${selectedTimer === "5" && "selected"}`}
              onClick={() => handleSelectTimer("5")}
            >
              5 sec
            </div>
            <div
              className={`timer ${selectedTimer === "10" && "selected"}`}
              onClick={() => handleSelectTimer("10")}
            >
              10 sec
            </div>
          </div>}
        </div>
      </div>
      <div className="cancelconfirm">
        <button onClick={handleCleanup} className="cancelbtn">
          Cancel
        </button>
        <button onClick={handleCreateQuiz} className="confirmbtn">Create Quiz</button>
      </div>
    </div>
  );
};

export default QuizModalPage2;
