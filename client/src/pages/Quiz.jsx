import React from 'react'
import "../styles/Quiz.css"
import Congratulations from '../components/Quiz/Congratulations'
import Questions from '../components/Quiz/Questions'

const Quiz = () => {
  return (
    <div className='quizcontainer'>
        {/* <Congratulations /> */}
        <Questions />
    </div>
  )
}

export default Quiz