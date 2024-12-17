import React, {useState, useContext, useEffect} from "react";
import "../styles/Analytics.css";
import AnalyticItem from "../components/Analytics/AnalyticItem";
import QWAnalytics from "./QWAnalytics";
import AnalyticsContext from "../context/AnalyticsContext";

const Analytics = () => {
  const [isSingle, setIsSingle] = useState(false);
  const {quizzes, getAllQuizzes, questions, quiz} = useContext(AnalyticsContext);

  useEffect(() => {
    getAllQuizzes();
  }, [])

  return (
    <>
      {isSingle ? (
        <QWAnalytics questions={questions} quiz={quiz} />
      ) : (
        <>
          <div className="analysis">
            <h1 className="analtitle">Quiz Analysis</h1>
            <div className="analtable">
              <table className="table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Quiz Name</th>
                    <th>Created On</th>
                    <th>Impression</th>
                    <th> </th>
                    <th> </th>
                  </tr>
                </thead>
                <tbody>
                  {quizzes.map((quiz, index) => (
                    <AnalyticItem key={index} quiz={quiz} setIsSingle={setIsSingle} index={index} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Analytics;
