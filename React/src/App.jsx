import { useState } from 'react'
import './App.css'
import Home from './components/home'
import Footer from './components/footer';

function App() {
  const [loggedIn, setLoggedIn] = useState('false');
  
  console.log(loggedIn);
  return (
    <>
    <div className='main'>
      <Home loggedIn={loggedIn}
        setLoggedIn={setLoggedIn}  />
      <Footer />
    </div>
    </>
  )
}

export default App
