import React from "react";
import "../styles/Sidebar.css";

const Sidebar = (props) => {
  const { changeSelected, selected } = props;
  return (
    <div className="sidebar">
      <h2 className="title">QUIZZIE</h2>

      <div className="sidemenu">
        <div
          onClick={() => changeSelected(0)}
          className={`sidemenuitem ${selected === 0 && "selected"}`}
        >
          Dashboard
        </div>
        <div onClick={() => changeSelected(1)} className={`sidemenuitem ${selected === 1 && "selected"}`}>
          Analytics
        </div>
        <div onClick={() => changeSelected(2)} className={`sidemenuitem ${selected === 2 && "selected"}`}>
          Create Quiz
        </div>
      </div>
      <div className="footer">
        <hr />
        <h6 className="logout">LOGOUT</h6>
      </div>
    </div>
  );
};

export default Sidebar;
