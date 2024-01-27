import React from 'react'
import { RxCross2 } from "react-icons/rx";

const Cong = (props) => {
    const {setShowModal} = props
  return (
    <div className='page cong'>
        <div className='cross'>
            <RxCross2 onClick={()=> setShowModal(false)} />
        </div>
        <h2>Congrats your Quiz is Published!</h2>
        <button className='share'>Share</button>
    </div>
  )
}

export default Cong