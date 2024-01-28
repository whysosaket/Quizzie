import React, {useState, useContext} from "react";
import "../styles/Sidebar.css";
import CreateQuizModal from "./Create/CreateQuizModal";
import GlobalContext from "../context/GlobalContext";
import {useNavigate} from 'react-router-dom'

const Sidebar = (props) => {
  const { changeSelected, selected } = props;
  const [showModal, setShowModal] = useState(false);
  const {handleLogout} = useContext(GlobalContext);
  const navigate = useNavigate();

  const handleLogoutClick = async ()=>{
    let res = await handleLogout();
    if(res){
      navigate('/auth')
    }
  }

  return (
    <>
    {showModal && <CreateQuizModal setShowModal={setShowModal} />}
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
        <div onClick={() => setShowModal(true)} className={`sidemenuitem`}>
          Create Quiz
        </div>
      </div>
      <div className="footer">
        <hr />
        <h6 onClick={handleLogoutClick} className="logout">LOGOUT</h6>
      </div>
    </div>
    </>
  );
};

export default Sidebar;
