import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { UserProvider } from './context/userContext.jsx';
import { LoadingProvider } from './context/loadingContext.jsx';
import './App.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LoadingProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </LoadingProvider>
  </React.StrictMode>,
)
