import React, { useState } from 'react'
import "../styles/auth/Auth.css"
import LoginForm from '../components/auth/LoginForm'
import SignupForm from '../components/auth/SignupForm'


const Auth = () => {

  const [wp, setWp] = useState(true);

  const showSignup = ()=>{
    setWp(false)
  }

  const showLogin = ()=>{
    setWp(true);
  }

  return (
    <>
      <div className='authbox'>
            <h1 className='title'>QUIZZIE</h1>
            <div className='authtabs'>
                <div onClick={showSignup} className={`authbutton ${!wp&&"selected"}`}>
                  Sign Up
                </div>
                <div onClick={showLogin} className={`authbutton ${wp&&"selected"}`}>
                  Log In
                </div>
            </div>
            <div className='authcontainer'>
                {
                  wp ?  <LoginForm /> : <SignupForm setWp={setWp} />
                }
            </div>
      </div>
    </>
  )
}

export default Auth