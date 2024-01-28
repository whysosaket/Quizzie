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
    const [currentPage, setCurrentPage] = useState(0);

  return (
    <div className='modal'>
        { currentPage === 0 && <QuizModalPage1 setShowModal={setShowModal} setCurrentPage={setCurrentPage} /> }
        { currentPage === 1 && <QuizModalPage2 setShowModal={setShowModal} setCurrentPage={setCurrentPage} /> }
        { currentPage === 2 && <Cong setShowModal={setShowModal} setCurrentPage={setCurrentPage} /> }
    </div>
  )
}

export default CreateQuizModal