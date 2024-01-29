import React from 'react'

const DeleteModal = (props) => {
  const {delete: handleDelete} = props;
  return (
    <div className='deletemodal'>
        <div className='delm'>
            <h1>Are you confirm you want to delete?</h1>
            <div className='buttons'>
                <button className='confirmbtn' onClick={handleDelete}>Confirm Delete</button>
                <button onClick={()=> props.setVisible(false)}>Cancel</button>
            </div>
        </div>
    </div>
  )
}

export default DeleteModal