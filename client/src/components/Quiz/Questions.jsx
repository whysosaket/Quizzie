import { useContext, useState, useEffect } from "react";
import QuizContext from "../../context/QuizContext";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import PropTypes from 'prop-types';
import Markdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/github.css'; // You can choose different styles

const delimeter = "@1&2^";

const Questions = ({ setIsFinished }) => {
  let url = import.meta.env.VITE_URL || "http://localhost:9000";
  const location = useLocation();
  const { getQuiz, takeQuiz, takePoll, takeQuizQuestions, takeQuizInfo } =
    useContext(QuizContext);

  const [email, setEmail] = useState("");
  const [regNo, setRegNo] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timer, setTimer] = useState(0);
  const [selected, setSelected] = useState(-1);
  const [questionTimers, setQuestionTimers] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  useEffect(() => {
    getQuiz(location.pathname.split("/")[2]);
  }, []);

  useEffect(() => {
    let countdown;

    if (
      takeQuizQuestions[questionNumber] &&
      takeQuizQuestions[questionNumber].timer === 0
    ) {
      return () => clearInterval(countdown);
    }

    if (isStarted && timer >= 0) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (
      isStarted &&
      timer === -1 &&
      questionNumber < takeQuizInfo.quesRandom.length - 1
    ) {
      setTimer(takeQuizQuestions[questionNumber + 1].timer);
      handleNext();
    } else if (
      isStarted &&
      timer === -1 &&
      questionNumber === takeQuizInfo.quesRandom.length - 1
    ) {
      handleFinish();
    }

    return () => clearInterval(countdown);
  }, [isStarted, timer, questionNumber]);

  const checkIfAttempted = async (email, regNo) => {
    try {
      const response = await fetch(
        `${url}/api/quiz/check_attempt?email=${encodeURIComponent(
          email
        )}&regNo=${encodeURIComponent(regNo)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      return { success: result.success, message: result.message };
    } catch (error) {
      console.error("Error in checkIfAttempted:", error);
      throw error;
    }
  };

  const startQuiz = async () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!email || !emailRegex.test(email)) {
      toast("Please enter a valid Gmail address.");
      return;
    }

    const { success, message } = await checkIfAttempted(email, regNo);
    if (success) {
      toast(message);
      return;
    }
    setQuestionTimers(Array(takeQuizQuestions.length).fill(0));
    setTimer(takeQuizQuestions[0].timer);
    setIsStarted(true);
  };

  const handleSelected = (index) => {
    setSelected(index);
  };

  const handleNext = () => {
    const newAnswers = [...answers];
    newAnswers.push(selected);

    const newTimers = [...questionTimers];
    newTimers[questionNumber] = takeQuizQuestions[questionNumber].timer - timer;

    setAnswers(newAnswers);
    setQuestionTimers(newTimers);
    setSelected(-1);
    setQuestionNumber(questionNumber + 1);
    setTimer(takeQuizQuestions[questionNumber + 1].timer);
  };

  const handleFinish = async () => {
    let newAnswers = [...answers];
    newAnswers.push(selected);

    const newTimers = [...questionTimers];
    newTimers[questionNumber] = takeQuizQuestions[questionNumber].timer - timer;

    let finalAnswers = [];
    for (let i = 0; i < takeQuizInfo.quesRandom.length; i++) {
      let ans = "";
      if (takeQuizQuestions[i].optionType === "text") {
        ans += takeQuizQuestions[i].options[newAnswers[i]];
        ans += delimeter;
      } else if (takeQuizQuestions[i].optionType === "img") {
        ans += delimeter;
        ans += takeQuizQuestions[i].imageOptions[newAnswers[i]];
      } else if (takeQuizQuestions[i].optionType === "both") {
        ans += takeQuizQuestions[i].options[newAnswers[i]];
        ans += delimeter;
        ans += takeQuizQuestions[i].imageOptions[newAnswers[i]];
      }
      finalAnswers.push(ans);
    }

    const quizData = {
      email,
      regNo,
      quizID: takeQuizInfo.quizID,
      answers: finalAnswers,
      questionTimers: newTimers,
    };

    if (takeQuizInfo.type === "poll") {
      await takePoll(takeQuizInfo.quizID, finalAnswers);
      setIsFinished(true);
      setIsCompleted(true);
      return;
    }
    await takeQuiz(quizData);
    setIsFinished(true);
    setIsCompleted(true);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-4xl">
        {isStarted ? (
          isCompleted ? (
            <div className="text-center p-12 bg-white rounded-2xl shadow-xl">
              <svg 
                className="w-20 h-20 mx-auto mb-6 text-gray-800" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <h1 className="text-3xl font-bold text-gray-800">
                Quiz Completed!
              </h1>
              <p className="mt-2 text-gray-600">
                Thank you for participating in the quiz.
              </p>
            </div>
          ) : (
            <div className="space-y-8 bg-white rounded-2xl shadow-xl p-8">
              <div className="flex justify-between items-center border-b border-gray-200 pb-6">
                <div className="flex items-center space-x-2">
                  <span className="text-3xl font-bold text-gray-800">
                    {String(questionNumber + 1).padStart(2, '0')}
                  </span>
                  <span className="text-gray-400 text-lg">
                    /{String(takeQuizInfo.quesRandom.length).padStart(2, '0')}
                  </span>
                </div>
                {takeQuizInfo.type === "qna" &&
                  takeQuizQuestions[questionNumber] &&
                  takeQuizQuestions[questionNumber].timer > 0 && (
                    <div className="flex items-center space-x-2">
                      <svg 
                        className="w-5 h-5 text-gray-600" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                        />
                      </svg>
                      <span className="text-xl font-mono text-gray-800">
                        00:{timer < 10 ? "0" : ""}{timer}
                      </span>
                    </div>
                  )}
              </div>

              <div className="py-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-8 markdown-content">
                  <Markdown 
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      code({node, inline, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <div className="code-block-wrapper my-4">
                            <div className="code-block-header bg-gray-100 px-4 py-2 rounded-t-lg border border-gray-200">
                              <span className="text-xs text-gray-600">{match[1]}</span>
                            </div>
                            <pre className="!mt-0 !bg-gray-50">
                              <code className={className} {...props}>
                                {children}
                              </code>
                            </pre>
                          </div>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {takeQuizQuestions[questionNumber]?.question}
                  </Markdown>
                </h2>

                <div className="space-y-4">
                  {takeQuizQuestions[questionNumber]?.options?.map((option, i) => (
                    <div
                      key={i}
                      onClick={() => handleSelected(i)}
                      className={`group p-6 rounded-xl border-2 cursor-pointer transition-all
                        ${selected === i 
                          ? 'border-gray-800 bg-gray-50' 
                          : 'border-gray-200 hover:border-gray-400'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center
                            ${selected === i 
                              ? 'border-gray-800 bg-gray-800' 
                              : 'border-gray-300 group-hover:border-gray-400'}`}
                          >
                            {selected === i && (
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <span className={`text-lg ${selected === i ? 'text-gray-800' : 'text-gray-600'}`}>
                            {option}
                          </span>
                        </div>
                        {takeQuizQuestions[questionNumber]?.imageOptions?.[i] && (
                          <img
                            src={takeQuizQuestions[questionNumber].imageOptions[i]}
                            alt={`option-${i}`}
                            className="max-h-24 object-contain rounded-lg"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-200">
                {questionNumber < takeQuizInfo.quesRandom.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="px-8 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-colors flex items-center space-x-2"
                  >
                    <span>Next Question</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={handleFinish}
                    className="px-8 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-colors flex items-center space-x-2"
                  >
                    <span>Submit Quiz</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )
        ) : (
          <div className="max-w-md mx-auto bg-white p-10 rounded-2xl shadow-xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {takeQuizInfo.name}
              </h1>
              <p className="text-gray-600">Enter your details to begin</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="your.email@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-800 focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Number
                </label>
                <input
                  type="text"
                  placeholder="Enter registration number"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  maxLength={10}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-800 focus:outline-none transition-colors"
                  required
                />
              </div>

              <button
                onClick={startQuiz}
                className="w-full py-4 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-colors font-medium mt-4"
              >
                Start Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

Questions.propTypes = {
  setIsFinished: PropTypes.func.isRequired
};

export default Questions;
