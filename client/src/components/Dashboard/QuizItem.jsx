import React from 'react'
import { AiOutlineEye } from "react-icons/ai";

const QuizItem = () => {
  return (
    <div className='quizitem'>
        <div className='top'>
            <div className='quizitemtitle'>Quiz 1</div>
            <div className='quizviews'>
                667
                <AiOutlineEye className='viewicon' />
            </div>
        </div>
        <div className='quizcreated'>Created on : 04 Sep, 2023</div>
    </div>
  )
}

export default QuizItem