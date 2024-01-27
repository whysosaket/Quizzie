import React from 'react';
import "../styles/QWAnalytics.css";
import QNAItem from '../components/Analytics/QNAItem';

const QWAnalytics = () => {
  return (
    <div className='qwacontainer'>
      <div className='title'>
        Quiz 2 Question Analysis
        <div className='littleinfo'>
          <h5>Created on: 04 Sep, 2023</h5>
          <h5>Impression: 667</h5>
        </div>
      </div>
      <div className='items'>
          <QNAItem />
          <QNAItem />
          <QNAItem />
          <QNAItem />
          <QNAItem />
      </div>
    </div>
  )
}

export default QWAnalytics