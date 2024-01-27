import React from 'react'

const Questions = () => {
  return (
    <div className='questions'>
        <div className='qtopbar'>
            <h2 className='questionno'>04/04</h2>
            <h2 className='timer'>00:10s</h2>
        </div>
        <h2 className='question'>Your question text comes here, its a sample text.</h2>
        <div className="options">
            <div className='option'>
                Option 1
            </div>
            <div className='option'>
                Option 2
            </div>
            <div className='option'>
                Option 3
            </div>
            <div className='option'>
                Option 4
            </div>
        </div>
        <div className="submit">
            <div className="submitbtn">
                Submit
            </div>
        </div>
    </div>
  )
}

export default Questions