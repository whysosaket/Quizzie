import React, {useRef, useContext} from "react";
import GlobalContext from "../../context/GlobalContext";
import {useNavigate} from "react-router-dom";

const LoginForm = () => {
  const emailRef = useRef();
  const passwordRef = useRef();

  const {login, toastMessage} = useContext(GlobalContext);
  const navigate = useNavigate();

  const handleLogin = async (e)=>{
    e.preventDefault();
    if (!emailRef.current.value || !passwordRef.current.value) {
      toastMessage("Please enter all fields", "warning");
      return;
    }
    let res = await login(emailRef.current.value, passwordRef.current.value);
    if(res){
      navigate('/')
    }
  }
  return (
    <div className="loginform">
      <div className="formitem">
        <div className="label">Email</div>
        <input ref={emailRef} type="text" className="" />
      </div>
      <div className="formitem">
        <div className="label">Password</div>
        <input ref={passwordRef} type="password" className="" />
      </div>
      <button onClick={handleLogin} className="submit">Log In</button>
    </div>
  );
};

export default LoginForm;
