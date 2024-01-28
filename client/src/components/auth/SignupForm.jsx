import React, {useRef, useContext} from "react";
import GlobalContext from "../../context/GlobalContext";

const SignupForm = (props) => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const nameRef = useRef();
  const cnfpasswordRef = useRef();
  const {setWp} = props;

  const {signup, toastMessage} = useContext(GlobalContext);

  const handleSignup = async (e)=>{
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const cnfpassword = cnfpasswordRef.current.value;

    e.preventDefault();

    if (!name || !email || !password || !cnfpassword) {
      toastMessage("Please enter all fields", "warning");
      return;
    }

    if(password !== cnfpassword){
      toastMessage("Passwords don't match", "warning");
      return;
    }

    let res = await signup(name, email, password);
    if(res){
      setWp(true);
    }
  }
  return (
    <div className="loginform">
      <div className="formitem">
        <div className="label">Name</div>
        <input ref={nameRef} type="text" className="" />
      </div>
      <div className="formitem">
        <div className="label">Email</div>
        <input ref={emailRef} type="text" className="" />
      </div>
      <div className="formitem">
        <div className="label">Password</div>
        <input ref={passwordRef} type="password" className="" />
      </div>
      <div className="formitem">
        <div className="label cnf">Confirm</div>
        <input ref={cnfpasswordRef} type="password" className="" />
      </div>
      <button onClick={handleSignup} className="submit">Sign Up</button>
    </div>
  );
};

export default SignupForm;
