import { useState, useEffect } from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Contexts
import { LoadingProvider } from './context/loadingContext'; 
import { useUserContext, UserProvider } from './context/userContext';
import { ChatProvider } from './context/chatContext';

// UI Components
import LoadingScreen from './components/LoadingScreen';
import Home from './components/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import Signup from './components/Signup';
import Chat from './components/Chat';

function App() {

  const { user } = useUserContext();

  const router = createBrowserRouter([
    {
      path: "/",
      element: user ? (
          <>
          <LoadingScreen/>
          <Header/>
          <main>
            <Home key={user._id}/>
          </main>
          <Footer />
        </>
      ) : (
          <>
          {console.log('User is not logged in.')}
          <LoadingScreen/>
          <main>
            <LandingPage key={'Guest'}/>
          </main>
          <Footer />
        </>
      )
    },
    {
      path: "/landing",
      element: (
        <>
        You landed! But there's nothing here.
        </>
      ),
    },
    {
      path: "/signup",
      element: (
        <>
          {/* <Header /> */}
          <LoadingScreen/>
          <main>
          <Signup />
          </main>
          <Footer />
        </>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <>
          <Header/>
          <LoadingScreen/>
          <main>
          <div>Dashboard! Yes, that's all that's here. For now.i</div>
          </main>
          <Footer />
        </>
      ),
    },
    {
      path: "/chat",
      element: (
        <>
          <Header />
          <LoadingScreen/>
          <main>
            <ChatProvider>
              <Chat />
            </ChatProvider>
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

