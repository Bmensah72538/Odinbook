import { useState } from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './components/Home';
import Footer from './components/Footer';

function App() {
  const [loggedIn, setLoggedIn] = useState('false');
  
  console.log(loggedIn);
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          {/* <Header /> */}
          <main>
            <Home loggedIn={loggedIn}
            setLoggedIn={setLoggedIn}  
            />
          </main>
          <Footer />
        </>
      ),
    },
    {
      path: "/profile",
      element: (
        <>
          {/* <Header /> */}
          <main>
          <div>Profile Page</div>
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

