import React from 'react'
import { AiOutlineEye } from "react-icons/ai";
import formatDate from '../../utils/FormatDate';

const QuizItem = (props) => {
  const {quiz} = props;

  let date = formatDate(quiz.createdOn);

  return (
    <div className='quizitem'>
        <div className='top'>
            <div className='quizitemtitle'>{quiz.name}</div>
            <div className='quizviews'>
                {quiz.impressions}
                <AiOutlineEye className='viewicon' />
            </div>
        </div>
        <div className='quizcreated'>Created on : {date}</div>
    </div>
  )
}

export default QuizItem