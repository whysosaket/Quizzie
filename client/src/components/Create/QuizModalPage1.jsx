import React, {useState, useRef, useContext} from 'react'
import GlobalContext from '../../context/GlobalContext';
import QuizContext from '../../context/QuizContext';

const options = [ "qna", "poll" ];

const QuizModalPage1 = (props) => {
    const {setShowModal, setCurrentPage} = props
    const [selected, setSelected] = useState(2);
    const {toastMessage} = useContext(GlobalContext);
    const {setInfo, cleanUp} = useContext(QuizContext);

    const handleSelected = (index) => {
        setSelected(index);
    }

    const nameRef = useRef();

    const handleContinue = () => {
        const name = nameRef.current.value;
        if(!name){
            toastMessage("Please enter a name for the quiz", "warning");
            return;
        }

        const type = options[selected];
        if(!type){
            toastMessage("Please select a type for the quiz", "warning");
            return;
        }
        cleanUp();
        setTimeout(() => {
            setInfo(name, type);
        }, 100);
        setCurrentPage(1);
    }

    const handleCleanup = () => {
        setShowModal(false);
        cleanUp();
    }


  return (
    <div className='page'>
        <input ref={nameRef} type='text' placeholder='Quiz Name' />
        <div className='quiztype'>
            <p>Quiz Type</p>
            <div className='quiztypebtns'>
                <button onClick={()=> handleSelected(0)} className={`btnopt ${selected==0&&"selected"}`}>Q&A Type</button>
                <button onClick={()=> handleSelected(1)}className={`btnopt ${selected==1&&"selected"}`}>Poll Type</button>
            </div>
        </div>
        <div className='cancelconfirm'>
            <button onClick={handleCleanup} className='cancelbtn'>Cancel</button>
            <button onClick={handleContinue} className='confirmbtn'>Continue</button>
        </div>
    </div>
  )
}

export default QuizModalPage1