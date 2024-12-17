import React from 'react'
import QNABox from './QNABox'
import PollBox from './PollBox'

const QNAItem = (props) => {
  const {question, index} = props;

  const type = question.type;

  return (
    <div className='qnaitem'>
        <h2>Q.{index+1} {question.question}</h2>
            {
                type === 'poll' ? <PollBox question={question} /> : <QNABox question={question} />
            }
        <hr />
    </div>
  )
}

export default QNAItem