import React from 'react'

const MyInfo = () => {
  return (
    <div className='myinfo'>
        <div className='myinfocards'>
        <h6 style={{color: "#FF5D01"}} className='myinfocard'>
            <span className='amount'>12</span>
            <span className='label'> Quizzes Created</span>
        </h6>

        <h6 style={{color: "#60B84B"}} className='myinfocard'>
            <span className='amount'>121</span>
            <span className='label'> Questions Created</span>
        </h6>

        <h6 style={{color: "#5076FF"}} className='myinfocard'>
            <span className='amount'>1.4K</span>
            <span className='label'> Total Impressions</span>
        </h6>
        </div>
    </div>
  )
}

export default MyInfo