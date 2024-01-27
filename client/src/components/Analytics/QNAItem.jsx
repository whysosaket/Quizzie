import React from 'react'
import QNABox from './QNABox'
import PollBox from './PollBox'

const QNAItem = () => {
  return (
    <div className='qnaitem'>
        <h2>Q.1 Question place holder for analysis ?</h2>
        {/* <QNABox /> */}
        <PollBox />
        <hr />
    </div>
  )
}

export default QNAItem