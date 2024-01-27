import React, {useState} from 'react'
import '../../styles/CreateQuiz.css'
import QuizModalPage1 from './QuizModalPage1'

const QuestionModel = {
    question: '',
    type: '',
    options: [
        {option: '', isCorrect: false, url: ''},
        {option: '', isCorrect: false, url: ''},
    ]
}

const maxOptions = 4;
const maxQuestions = 5;

const CreateQuizModal = (props) => {
    const {setShowModal} = props
    const [questions, setQuestions] = useState([]);
  return (
    <div className='modal'>
        <QuizModalPage1 setShowModal={setShowModal} />
    </div>
  )
}

export default CreateQuizModal