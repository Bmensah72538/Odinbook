import { useState, useEffect } from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './components/Home';
import Footer from './components/Footer';
import Signup from './components/Signup';

function App() {
  const [loggedIn, setLoggedIn] = useState('false');
  
  // Check if the user is logged in when the app mounts
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      setLoggedIn(true); // If token exists, user is logged in
    }
  }, []);

  console.log(loggedIn);
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          {/* <Header /> */}
          <main>
            <Home />
          </main>
          <Footer />
        </>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <>
          {/* <Header /> */}
          <main>
          <div>Dashboard! Yes, that's all that's here.</div>
          </main>
          <Footer />
        </>
      ),
    },
    {
      path: "/signup",
      element: (
        <>
          {/* <Header /> */}
          <main>
          <Signup />
          </main>
          <Footer />
        </>
      ),
    },
  ]);
  return (
    <>    
    <RouterProvider router={router} />
    </>
  )
}

export default App;

