import React, {useState} from 'react'
import '../styles/Home.css'
import Sidebar from '../components/Sidebar'
import Dashboard from './Dashboard'
import CreateQuiz from './CreateQuiz'
import Analytics from './Analytics'

const pages = ['Dashboard', 'Analytics', 'Create Quiz']

const Home = () => {
    const [selected, setSelected] = useState(0)

    const changeSelected = (index)=>{
        setSelected(index)
    }
  return (
    <div className='home'>
        <Sidebar changeSelected={changeSelected} />
        <div>
            {selected === 0 && <Dashboard />}
            {selected === 1 && <Analytics />}
            {selected === 2 && <CreateQuiz />}
        </div>
    </div>
  )
}

export default Home