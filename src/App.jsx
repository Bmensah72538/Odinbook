import { useState, useEffect } from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Contexts
import { LoadingProvider } from './context/loadingContext'; 
import { useUserContext } from './context/userContext';
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
  // Check if the user is logged in when the app mounts
  const { user } = useUserContext();

  const router = createBrowserRouter([
    {
      path: "/",
      element:  user ? (
          <>
          <LoadingScreen/>
          <Header/>
          <main>
            <Home key={user} />
          </main>
          <Footer />
        </>
        ) : (
          <>
          <LoadingScreen/>
          <main>
            <LandingPage key={'Guest'}/>
          </main>
          <Footer />
        </>
        ),
    },
    {
      path: "/login",
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
          {/* <Header /> */}
          <LoadingScreen/>
          <main>
          <div>Dashboard! Yes, that's all that's here.</div>
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
    <LoadingProvider>
      <RouterProvider router={router} />
    </LoadingProvider>
    </>
  )
}

export default App;

