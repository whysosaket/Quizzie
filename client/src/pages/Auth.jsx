import React, { useState, useContext, useEffect } from 'react'
import "../styles/auth/Auth.css"
import LoginForm from '../components/auth/LoginForm'
import SignupForm from '../components/auth/SignupForm'
import {useNavigate} from 'react-router-dom'
import GlobalContext from '../context/GlobalContext'


const Auth = () => {

  const [wp, setWp] = useState(true);
  const {isAuthenticated} = useContext(GlobalContext);

  const showSignup = ()=>{
    setWp(false)
  }

  const showLogin = ()=>{
    setWp(true);
  }

  const navigate = useNavigate();

  useEffect(() => {
      if(isAuthenticated){
          navigate('/')
      }
  }, [isAuthenticated])

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