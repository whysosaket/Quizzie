import React, {useState, useContext, useEffect} from 'react'
import '../styles/Home.css'
import Sidebar from '../components/Sidebar'
import Dashboard from './Dashboard'
import CreateQuiz from './CreateQuiz'
import Analytics from './Analytics'
import QWAnalytics from './QWAnalytics'
import GlobalContext from '../context/GlobalContext'
import {useNavigate} from 'react-router-dom'

const pages = ['Dashboard', 'Analytics', 'Create Quiz']

const Home = () => {
    const [selected, setSelected] = useState(0);
    const {isAuthenticated} = useContext(GlobalContext);

    const navigate = useNavigate();

    useEffect(() => {
        if(!isAuthenticated){
            navigate('/auth')
        }
    }, [])

    const changeSelected = (index)=>{
        setSelected(index)
    }


  return (
    <div className='home'>
        <Sidebar changeSelected={changeSelected} selected={selected} />
        <div className='homeright'>
            {selected === 0 && <Dashboard />}
            {selected === 1 && <Analytics />}
            {selected === 2 && <CreateQuiz />}
        </div>
    </div>
  )
}

export default Home