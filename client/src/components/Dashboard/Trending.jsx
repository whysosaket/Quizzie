import React from 'react'
import QuizItem from './QuizItem'

const Trending = () => {
  return (
    <div className='trending'>
        <h1 className='trendingtitle'>Trending Quizs</h1>
        <div className='trendingquizs'>
            <QuizItem />
            <QuizItem />
            <QuizItem />
            <QuizItem />
            <QuizItem />
            <QuizItem />
            <QuizItem />
            <QuizItem />
            <QuizItem />
            <QuizItem />
        </div>
    </div>
  )
}

export default Trending