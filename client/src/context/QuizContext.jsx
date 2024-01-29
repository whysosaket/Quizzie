import { createContext, useState } from "react";
import { toast } from "react-toastify";

const QuizContext = createContext();
let url = import.meta.env.VITE_URL;

const QuizState = (props) => {

    const toastMessage = (message, type) => {
        if (type === "success") toast.success(message);
        else if (type === "error") toast.error(message);
        else if (type === "warning") toast.warning(message);
        else toast.info(message);
      };

    const [quizInfo, setQuizInfo] = useState({name: "", type: ""});
    const [questions, setQuestions] = useState([1,2,3,4,5]);

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
        console.log(quizInfo)
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
            timer,
            correctAnswer
        }   

        const newQuestions = [...questions];
        newQuestions[index] = newQuestion;
        setQuestions(newQuestions);
        console.log(newQuestions);
    }

    const deleteQuestion = async (index) => {
        let newQuestions = [...questions];
        newQuestions = newQuestions.filter((question, i) => i !== index);
        setQuestions(newQuestions);

        await waitPromise();
        return true;
    }

    const waitPromise = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 200);
        })
    }

    const createQuiz = async () => {
        const {name, type} = quizInfo;
        const questionss = [...questions];
        const body = {name, type, questions: questionss};
        try {
            const response = await fetch(`${url}/api/quiz/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("token")
                },
                body: JSON.stringify(body)
            });
            const data = await response.json();
            console.log(data);
            if(data.success){
                toastMessage(data.info, "success");
                cleanUp();
                return true;
            }else{
                toastMessage(data.error, "warning");
                cleanUp();
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
        
    }


   

    return (
        <QuizContext.Provider value={{setName, setType, cleanUp, quizInfo, createQuestion, questions, deleteQuestion, createQuiz}}>
            {props.children}
        </QuizContext.Provider>
    )
}

export default QuizContext
export { QuizState }