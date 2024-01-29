import React, {useContext} from 'react'
import { RxCross2 } from "react-icons/rx";
import QuizContext from '../../context/QuizContext';

const Cong = (props) => {
    const {setShowModal} = props
    const {toastMessage, shareLink} = useContext(QuizContext);

    const url = shareLink;

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        toastMessage("Copied to clipboard!", "success");
    }
  return (
    <div className='page cong'>
        <div className='cross'>
            <RxCross2 onClick={()=> setShowModal(false)} />
        </div>
        <h2>Congrats your Quiz is Published!</h2>
        <input className='url' type='text' value={url} disabled />
        <button onClick={handleCopy} className='share'>Share</button>
    </div>
  )
}

export default Cong