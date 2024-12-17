import React, {useEffect, useContext} from 'react'
import QuizItem from './QuizItem'
import GlobalContext from '../../context/GlobalContext'



const Trending = () => {
    const {trending, getTrending} = useContext(GlobalContext);

    useEffect(() => {
        getTrending();
    }, []);
  return (
    <div className='trending'>
        <h1 className='trendingtitle'>Trending Quizs</h1>
        <div className='trendingquizs'>
            {
                trending.map((quiz, index) => (
                    <QuizItem key={index} quiz={quiz} />
                ))
            }
        </div>
    </div>
  )
}

export default Trending