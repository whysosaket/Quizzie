import React, { useContext, useEffect } from "react";
import GlobalContext from "../../context/GlobalContext";

const MyInfo = () => {
  const { user, getInfo } = useContext(GlobalContext);
  useEffect(() => {
    getInfo();
  }, []);

  return (
    <div className="myinfo">
      <div className="myinfocards">
        <h6 style={{ color: "#FF5D01" }} className="myinfocard">
          <span className="amount">{user.quizCreated}</span>
          <span className="label"> Quizzes Created</span>
        </h6>

        <h6 style={{ color: "#60B84B" }} className="myinfocard">
          <span className="amount">{user.questionsCreated}</span>
          <span className="label"> Questions Created</span>
        </h6>

        <h6 style={{ color: "#5076FF" }} className="myinfocard">
          <span className="amount">{user.totalImpressions}</span>
          <span className="label"> Total Impressions</span>
        </h6>
      </div>
    </div>
  );
};

export default MyInfo;
