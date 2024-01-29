import React, { useContext, useRef, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { RiDeleteBin6Fill } from "react-icons/ri";
import GlobalContext from '../../context/GlobalContext';
import QuizContext from '../../context/QuizContext';



const QuizModalPage2 = (props) => {
    const { setShowModal } = props;
    const { toastMessage } = useContext(GlobalContext);
    const { cleanUp, createQuestion, quizInfo, questions } = useContext(QuizContext);

    const [questionType, setQuestionType] = useState("text");
    const [selectedOption, setSelectedOption] = useState(-1);
    const [selectedTimer, setSelectedTimer] = useState("0");
    const [options, setOptions] = useState(["option1", "option2"]);
    const [questionNumber, setQuestionNumber] = useState([1]);
    const [selectedQuestion, setSelectedQuestion] = useState(0);


    const handleCleanup = () => {
        setShowModal(false);
        cleanUp();
    }

    const questionRef = useRef();
    const optionRef = [useRef(), useRef(), useRef(), useRef()];
    const optionImgRef = [useRef(), useRef(), useRef(), useRef()];

    const handleAddOption = ()=>{
        if(options.length === 4){
            toastMessage("Max 4 options allowed", "warning");
            return;
        }
        setOptions([...options, "option"+(options.length+1)]);
    }

    const handleDeleteOption = (index)=>{
      console.log(index);
        if(options.length === 2){
            toastMessage("Min 2 options required", "warning");
            return;
        }
        let newOptions = [];
        options.forEach((option, i)=>{
            if(i!==index){
                newOptions.push(option);
            }
        })
        
        if (index===2 && options.length===4){
          if (optionRef[2].current)
            optionRef[2].current.value = optionRef[3].current.value;
          if (optionImgRef[2].current)
            optionImgRef[2].current.value = optionImgRef[3].current.value;
        }

        setOptions(newOptions);
        setSelectedOption(-1);

    }

    const handleAddQuestion = (a) => {
        const question = questionRef.current.value;
        if(!question){
            toastMessage("Please enter a question", "warning");
            return;
        }

        const optionType = questionType;

        let option1, option2, option3, option4, option1img, option2img, option3img, option4img;
        if(optionRef[0].current) option1 = optionRef[0].current.value;
        if(optionRef[1].current) option2 = optionRef[1].current.value;
        if(optionRef[2].current) option3 = optionRef[2].current.value;
        if(optionRef[3].current) option4 = optionRef[3].current.value;

        if(optionImgRef[0].current) option1img = optionImgRef[0].current.value;
        if(optionImgRef[1].current) option2img = optionImgRef[1].current.value;
        if(optionImgRef[2].current) option3img = optionImgRef[2].current.value;
        if(optionImgRef[3].current) option4img = optionImgRef[3].current.value;

        if(optionImgRef[0].current && !optionImgRef[0].current.value){
            toastMessage("Please enter image url for option 1", "warning");
            return;
        }

        if(optionImgRef[1].current && !optionImgRef[1].current.value){
            toastMessage("Please enter image url for option 2", "warning");
            return;
        }

        if(optionImgRef[2].current && !optionImgRef[2].current.value){
            toastMessage("Please enter image url for option 3", "warning");
            return;
        }

        if(optionImgRef[3].current && !optionImgRef[3].current.value){
            toastMessage("Please enter image url for option 4", "warning");
            return;
        }

        if(optionRef[0].current && !optionRef[0].current.value){
            toastMessage("Please enter text for option 1", "warning");
            return;
        }

        if(optionRef[1].current && !optionRef[1].current.value){
            toastMessage("Please enter text for option 2", "warning");
            return;
        }

        if(optionRef[2].current && !optionRef[2].current.value){
            toastMessage("Please enter text for option 3", "warning");
            return;
        }

        if(optionRef[3].current && !optionRef[3].current.value){
            toastMessage("Please enter text for option 4", "warning");
            return;
        }

        const timer = selectedTimer;
        let correctAnswer;
        if(optionType === "text"){
            if (selectedOption === 0) correctAnswer = option1;
            else if (selectedOption === 1) correctAnswer = option2;
            else if (selectedOption === 2) correctAnswer = option3;
            else if (selectedOption === 3) correctAnswer = option4;
        }else if(optionType === "imageUrl"){
            if (selectedOption === 0) correctAnswer = option1img;
            else if (selectedOption === 1) correctAnswer = option2img;
            else if (selectedOption === 2) correctAnswer = option3img;
            else if (selectedOption === 3) correctAnswer = option4img;
        }else if(optionType === "textAndImageUrl"){
            if (selectedOption === 0) correctAnswer = option1 + " " + option1img;
            else if (selectedOption === 1) correctAnswer = option2 + " " + option2img;
            else if (selectedOption === 2) correctAnswer = option3 + " " + option3img;
            else if (selectedOption === 3) correctAnswer = option4 + " " + option4img;
        }

        // check if all options are filled
        if((!option1 || !option2) && (!option1img || !option2img)){
            toastMessage("Please enter atleast 2 options", "warning");
            return;
        }

        // check if correct answer is filled
        if(!correctAnswer){
            toastMessage("Please select a correct answer", "warning");
            return;
        } 

        let finalOptionType;
        if(optionType === "text"){
            finalOptionType = "text";
        }else if(optionType === "imageUrl"){
            finalOptionType = "img";
        }else if(optionType === "textAndImageUrl"){
            finalOptionType = "both";
        }


        createQuestion(
            selectedQuestion,
            question,
            quizInfo.type,
            finalOptionType,
            optionRef[0].current,
            optionRef[1].current,
            optionRef[2].current,
            optionRef[3].current,
            optionImgRef[0].current,
            optionImgRef[1].current,
            optionImgRef[2].current,
            optionImgRef[3].current,
            timer,
            correctAnswer
        )

        if(!a){
        setQuestionNumber([...questionNumber, questionNumber.length+1]);

            reset();
        }
    }

    const saveChanges = () => {
        handleAddQuestion(true);
    }

    const handleQuestionSelect = (index) => {
        if(index===selectedQuestion) return;
        if(!questions[index]) {
            reset();
        }
        setSelectedQuestion(index);
        questionRef.current.value = questions[index].question;
        setQuestionType(questions[index].optionType);
        setSelectedTimer(questions[index].timer);

        // set options
        for(let i=0;i<questions[index].options.length;i++){
            if(questions[index].options[i]!==undefined) optionRef[i].current.value = questions[index].options[i];
            else optionRef[i].current = null;
            if(questions[index].imageOptions[i]!==undefined) optionImgRef[i].current.value = questions[index].imageOptions[i];
            else optionImgRef[i].current = null;
        }
    }

    const reset = () => {
         // reset all fields
         questionRef.current.value = "";
         optionRef[0].current.value = "";
         optionRef[1].current.value = "";
         optionRef[2].current = null;
         optionRef[3].current = null;
         optionImgRef[0].current = null;
         optionImgRef[1].current = null;
         optionImgRef[2].current = null;
         optionImgRef[3].current = null;
         setSelectedOption(-1);
         setSelectedTimer("0");
 
         setOptions(["option1", "option2"]);
         setQuestionType("text");
         setSelectedQuestion(questionNumber.length);
    }

    return (
        <div className="page page2">
            <div className="topbar">
                <div className="topbarleft">
                    {questionNumber.map((question, index) => {
                        return (
                            <div onClick={()=> handleQuestionSelect(index)} key={index} className={`questionselector ${selectedQuestion===index&&"selected"}`}>
                                <h6>{index + 1}</h6>
                            </div>
                        );
                    })}
                    {questionNumber.length < 5 &&  <div onClick={()=> handleAddQuestion(false)} className="questionselector">
                          <FiPlus />
                      </div>}
                </div>
                <div>
                <h6>Max 5 questions</h6>
                    <button onClick={saveChanges} className="confirmbtn oo">Save</button>
                </div>
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
                            checked={questionType === "text"}
                            onChange={() => setQuestionType("text")}
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
                            onChange={() => setQuestionType("imageUrl")}
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
                            onChange={() => setQuestionType("textAndImageUrl")}
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
                                <input
                                    type="radio"
                                    name="option"
                                    className="btnopt "
                                    value={option}
                                    checked={selectedOption === index}
                                    onChange={() => setSelectedOption(index)}
                                />
                                {(questionType === "text" || questionType === "textAndImageUrl") && (
                                    <input ref={optionRef[index]} className={`${selectedOption === index && "selected"}`} type="text" placeholder="Text" />
                                )}
                                {(questionType === "imageUrl" || questionType === "textAndImageUrl") && (
                                    <input ref={optionImgRef[index]} className={`${selectedOption === index && "selected"} imageoption`} type="text" placeholder="Image URL" />
                                )}
                                
                            </label>
                            {index>1 && <RiDeleteBin6Fill onClick={()=> handleDeleteOption(index)} className="deleteicon" />}
                            </div>
                        );
                    })}

                    {options.length<4&&<div onClick={handleAddOption} className="addoption">
                        Add Option
                    </div>}
                </div>
                <div className="bottomright">
                <div className="timeroptions">
                <h6>Timer</h6>
                <div className={`timer ${selectedTimer === "0" && "selected"}`} onClick={() => setSelectedTimer("0")}>
                    OFF
                </div>
                <div className={`timer ${selectedTimer === "5" && "selected"}`} onClick={() => setSelectedTimer("5")}>
                    5 sec
                </div>
                <div className={`timer ${selectedTimer === "10" && "selected"}`} onClick={() => setSelectedTimer("10")}>
                    10 sec
                </div>
            </div>
                </div>
            </div>
            <div className="cancelconfirm">
                <button onClick={handleCleanup} className="cancelbtn">Cancel</button>
                <button className="confirmbtn">Create Quiz</button>
            </div>
        </div>
    );
};

export default QuizModalPage2;
