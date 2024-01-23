import React from 'react'
import "../styles/Sidebar.css"

const Sidebar = (props) => {

    const {changeSelected} = props
  return (
    <div className='sidebar'>
        <h2 className='title'>QUIZZIE</h2>

        <div className='sidemenu'>
            <div onClick={()=>changeSelected(0)} className='sidemenuitem selected'>
                Dashboard
            </div>
            <div onClick={()=>changeSelected(1)} className='sidemenuitem'>
                Analytics
            </div>
            <div onClick={()=>changeSelected(2)} className='sidemenuitem'>
                Create Quiz
            </div>
        </div>
        <div className='footer'>
            <hr />
            <h6 className='logout'>LOGOUT</h6>
        </div>
    </div>
  )
}

export default Sidebar