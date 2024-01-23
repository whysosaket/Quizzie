import React from "react";

const LoginForm = () => {
  return (
    <div className="loginform">
      <div className="formitem">
        <div className="label">Email</div>
        <input type="text" className="" />
      </div>
      <div className="formitem">
        <div className="label">Password</div>
        <input type="password" className="" />
      </div>
      <button className="submit">Log In</button>
    </div>
  );
};

export default LoginForm;
