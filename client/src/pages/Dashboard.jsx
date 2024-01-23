import React from 'react'
import "../styles/Dashboard.css"
import MyInfo from '../components/Dashboard/MyInfo'
import Trending from '../components/Dashboard/Trending'

const Dashboard = () => {
  return (
    <div>
        <MyInfo />
        <Trending />
    </div>
  )
}

export default Dashboard