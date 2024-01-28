import React from 'react';
import "../styles/QWAnalytics.css";
import QNAItem from '../components/Analytics/QNAItem';
import formatDate from '../utils/FormatDate';

const QWAnalytics = (props) => {
  const {questions, quiz} = props;
  let date = formatDate(quiz.createdOn);
  return (
    <div className='qwacontainer'>
      <div className='title'>
        {quiz.name} Question Analysis
        <div className='littleinfo'>
          <h5>Created on: {date}</h5>
          <h5>Impression: {quiz.impressions}</h5>
        </div>
      </div>
      <div className='items'>
          {
            questions.map((question, index)=>(
              <QNAItem key={index} question={question} index={index} />
            ))
          }
      </div>
    </div>
  )
}

export default QWAnalytics