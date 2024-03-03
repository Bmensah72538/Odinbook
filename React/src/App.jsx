import { useState } from 'react'
import './App.css'
import Home from './components/home'
import Login from './components/login'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className='main'>
      <Home />
      <br />
      <Login />

    </div>
    </>
  )
}

export default App
