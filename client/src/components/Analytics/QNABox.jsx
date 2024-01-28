import React from 'react'

const QNABox = (props) => {
  const {question} = props;
  return (
    <>
     <div className='boxes'>
            <div className='box'>
                <h1>{question.attempts}</h1>
                <h3>People Attemted the question</h3>
            </div>
            <div className='box'>
                <h1>{question.correct}</h1>
                <h3>People Answered Correctly</h3>
            </div>
            <div className='box'>
                <h1>{question.incorrect}</h1>
                <h3>People Answered Incorrectly</h3>
            </div>
        </div>
    </>
  )
}

export default QNABox