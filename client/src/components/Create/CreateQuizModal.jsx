import React, {useState} from 'react'
import '../../styles/CreateQuiz.css'
import QuizModalPage1 from './QuizModalPage1'
import QuizModalPage2 from './QuizModalPage2';
import Cong from './Cong';

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
        {/* <QuizModalPage2 setShowModal={setShowModal} /> */}
        <Cong setShowModal={setShowModal} />
    </div>
  )
}

export default CreateQuizModal