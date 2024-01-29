import React, {useState} from 'react'
import "../styles/Quiz.css"
import Congratulations from '../components/Quiz/Congratulations'
import Questions from '../components/Quiz/Questions'

const Quiz = () => {
  const [isFinished, setIsFinished] = useState(false);
  return (
    <div className='quizcontainer'>
      {isFinished ? <Congratulations /> : <Questions setIsFinished={setIsFinished} />}
    </div>
  )
}

export default Quiz