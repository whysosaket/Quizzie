import { createContext, useState } from "react";

const QuizContext = createContext();

const QuizState = (props) => {

    const [quizInfo, setQuizInfo] = useState({name: "", type: ""});
    const [questions, setQuestions] = useState([]);

    const cleanUp = () => {
        setQuizInfo({name: "", type: ""});
        setQuestions([]);
    }

    const setName = (name) => {
        setQuizInfo({...quizInfo, name});
    }

    const setType = (type) => {
        setQuizInfo({...quizInfo, type});
    }

    const createQuestion = (index, question, type, optionType, option1, option2, option3, option4, option1img, option2img, option3img, option4img, timer, correctAnswer) => {

        const newQuestion = {
            question,
            type,
            optionType,
            options: [
                option1&&option1.value,
                option2&&option2.value,
                option3&&option3.value,
                option4&&option4.value
            ],
            imageOptions: [
                option1img&&option1img.value,
                option2img&&option2img.value,
                option3img&&option3img.value,
                option4img&&option4img.value
            ],
            timer,
            correctAnswer
        }   

        const newQuestions = [...questions];
        newQuestions[index] = newQuestion;
        setQuestions(newQuestions);
    }


   

    return (
        <QuizContext.Provider value={{setName, setType, cleanUp, quizInfo, createQuestion, questions}}>
            {props.children}
        </QuizContext.Provider>
    )
}

export default QuizContext
export { QuizState }