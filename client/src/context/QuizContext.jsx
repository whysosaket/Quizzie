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

    const createQuestion = (question, type, optionType, option1, option2, option3, option4, option1img, option2img, option3img, option4img, timer, correctAnswer) => {

        const newQuestion = {
            question,
            type,
            optionType,
            options: [
                option1,
                option2,
                option3,
                option4
            ],
            imageOptions: [
                option1img,
                option2img,
                option3img,
                option4img
            ],
            correctAnswer,
            timer
        }

        setQuestions([...questions, newQuestion]);
    }


   

    return (
        <QuizContext.Provider value={{setName, setType, cleanUp, quizInfo, createQuestion}}>
            {props.children}
        </QuizContext.Provider>
    )
}

export default QuizContext
export { QuizState }