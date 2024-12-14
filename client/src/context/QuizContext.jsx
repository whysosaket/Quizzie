import { createContext, useState } from "react";
import { toast } from "react-toastify";

const QuizContext = createContext();
let url = import.meta.env.VITE_URL || "http://localhost:9000";
let clientUrl = import.meta.env.VITE_CLIENT;

const QuizState = (props) => {
  const toastMessage = (message, type) => {
    if (type === "success") toast.success(message);
    else if (type === "error") toast.error(message);
    else if (type === "warning") toast.warning(message);
    else toast.info(message);
  };

  const [quizInfo, setQuizInfo] = useState({ name: "", type: "" });
  const [questions, setQuestions] = useState([1, 2, 3, 4, 5]);
  const [shareLink, setShareLink] = useState("");

  const cleanUp = () => {
    setQuizInfo({ name: "", type: "" });
    setQuestions([]);
  };

  const setInfo = (name, type) => {
    setQuizInfo({ name, type });
  };

  const createQuestion = (
    index,
    question,
    type,
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
  ) => {
    //console.log(timer + "oi");
    const newQuestion = {
      question,
      type,
      optionType,
      options: [option1, option2, option3, option4],
      imageOptions: [option1img, option2img, option3img, option4img],
      timer: Number(timer),
      correctAnswer,
    };

    const newQuestions = [...questions];
    newQuestions[index] = newQuestion;
    setQuestions(newQuestions);
  };

  const deleteQuestion = async (index) => {
    let newQuestions = [...questions];
    newQuestions = newQuestions.filter((question, i) => i !== index);
    setQuestions(newQuestions);

    await waitPromise();
    return true;
  };

  const waitPromise = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 200);
    });
  };

  const createQuiz = async () => {
    const { name, type } = quizInfo;
    const questionss = [...questions];
    const body = { name, type, questions: questionss };
    //console.log(body);
    try {
      const response = await fetch(`${url}/api/quiz/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      //console.log(data);
      if (data.success) {
        toastMessage(data.info, "success");
        setShareLink(`${clientUrl}/quiz/${data.quizID}`);
        cleanUp();
        return true;
      } else {
        toastMessage(data.error, "warning");
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // QUIZ Section

  const [takeQuizInfo, setTakeQuizInfo] = useState({
    name: "",
    type: "",
    question: "",
    questions: [],
    quizID: "",
  });
  const [takeQuizAnswers, setTakeQuizAnswers] = useState([]);
  const [takeQuizQuestions, setTakeQuizQuestions] = useState([]);
  const [result, setResult] = useState({ score: 0, total: 0 });

  const getQuiz = async (quizID) => {
    try {
      const response = await fetch(`${url}/api/quiz/${quizID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        const { name, type, question, questions, quizID } = data.quiz;
        //console.log(questions);
        let quesRandom = [];
        var random = 5;
        let easyQues = [];
        let medQues = [];
        let hardQues = [];
        for (let i = 0; i < questions.length; i++) {
          const questionID = questions[i];
          let ques = await getQuestion(questionID);
          if (ques.timer == 30) easyQues.push(questionID);
          //console.log(ques.timer);
        }
        for (let i = 0; i < questions.length; i++) {
          const questionID = questions[i];
          let ques = await getQuestion(questionID);
          if (ques.timer == 60) medQues.push(questionID);
          //console.log(ques.timer);
        }
        //console.log(medQues);
        for (let i = 0; i < questions.length; i++) {
          const questionID = questions[i];
          let ques = await getQuestion(questionID);
          if (ques.timer == 90) hardQues.push(questionID);
          //console.log(ques.timer);
        }
        //console.log("Question length " + questions);
        // if that question not already included from questions then include it
        while (quesRandom.length < random) {
          const randomIndex = Math.floor(Math.random() * easyQues.length);
          const selectedQuestion = easyQues[randomIndex];
          if (!quesRandom.includes(selectedQuestion)) {
            quesRandom.push(selectedQuestion);
          }
        }
        while (quesRandom.length < random + 5) {
          const randomIndex = Math.floor(Math.random() * medQues.length);
          const selectedQuestion = medQues[randomIndex];
          if (!quesRandom.includes(selectedQuestion)) {
            quesRandom.push(selectedQuestion);
          }
        }
        while (quesRandom.length < random + 10) {
          const randomIndex = Math.floor(Math.random() * hardQues.length);
          const selectedQuestion = hardQues[randomIndex];
          if (!quesRandom.includes(selectedQuestion)) {
            quesRandom.push(selectedQuestion);
          }
        }
        //console.log(quesRandom);
        setTakeQuizInfo({ name, type, question, quesRandom, quizID });
        let newQuestions = [];
        for (let i = 0; i < quesRandom.length; i++) {
          const questionID = quesRandom[i];
          //console.log(`Requesting question ID: ${questionID}`);
          let ques = await getQuestion(questionID);
          newQuestions.push(ques);
        }

        //console.log(newQuestions);
        setTakeQuizQuestions(newQuestions);
        return true;
      } else {
        toastMessage(data.error, "warning");
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const getQuestion = async (questionID) => {
    try {
      const response = await fetch(`${url}/api/question/${questionID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      //console.log("DATA");
      //console.log(data);
      if (data.success) {
        return data.question;
      } else {
        console.log("QUES ID", questionID);
        toastMessage(data.error, "warning");
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const takeQuiz = async ({
    quizID,
    answers,
    email,
    regNo,
    questionTimers,
  }) => {
    const body = { answers, email, regNo, takeQuizQuestions };
    const qid = quizID;
    //console.log(answers);
    try {
      //console.log(quizID);
      const response = await fetch(`${url}/api/quiz/${quizID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      //console.log(data.success);
      if (data.success) {
        const { score, total } = data.result;
        setResult({ score, total });
        //console.log("Data:", data);

        const questionAnswerPairs = data.result.questionAnswerPairs;
        //console.log("Question Answer Pairs:", questionAnswerPairs);

        const scoreBody = {
          quizID,
          email,
          regNo,
          score,
          total,
          questionTimers,
          questionAnswerPairs,
        };
        //console.log("START");
        //console.log(questionAnswerPairs);
        //console.log("END");
        const scoreResponse = await fetch(`${url}/api/quiz/save_score`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(scoreBody),
        });
        const scoreData = await scoreResponse.json();
        console.log(scoreData.success);
        if (scoreData.success) {
          console.log("Score saved successfully");
        } else {
          toastMessage(scoreData.error || "Failed to save score", "warning");
        }

        return true;
      } else {
        toastMessage(data.error, "warning");
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const takePoll = async (quizID, answers) => {
    const body = { quizID, answers };
    try {
      const response = await fetch(`${url}/api/poll/${quizID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (data.success) {
        return true;
      } else {
        toastMessage(data.error, "warning");
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return (
    <QuizContext.Provider
      value={{
        result,
        takePoll,
        getQuiz,
        takeQuizQuestions,
        takeQuizInfo,
        takeQuiz,
        setInfo,
        toastMessage,
        shareLink,
        cleanUp,
        quizInfo,
        createQuestion,
        questions,
        deleteQuestion,
        createQuiz,
      }}
    >
      {props.children}
    </QuizContext.Provider>
  );
};

export default QuizContext;
export { QuizState };
