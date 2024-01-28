import { createContext, useState } from "react";

const AnalyticsContext = createContext();
let url = import.meta.env.VITE_URL;

const AnalyticsState = (props) => {

    const [quizzes, setQuizzes] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [quiz, setQuiz] = useState({name: "", createdOn: "", impressions: 0});

    const getAllQuizzes = async () => {
        try {
            const response = await fetch(`${url}/api/analytics/allquiz`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("token"),
                },
            });
            const data = await response.json();
            if (data.success) {
                setQuizzes(data.quizzes);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }

    const getAllQuestions = async (quizid) => {
        try {
            const response = await fetch(`${url}/api/analytics/getquestions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("token"),
                },
                body: JSON.stringify({ quizid }),
            });
            const data = await response.json();
            if (data.success) {
                setQuestions(data.questions);
                setQuiz(data.quiz);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }


    return (
        <AnalyticsContext.Provider value={{quizzes, getAllQuizzes, questions, getAllQuestions, quiz}}>
            {props.children}
        </AnalyticsContext.Provider>
    )
}

export default AnalyticsContext;

export { AnalyticsState };