import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for global loading state
const LoadingContext = createContext();

// Create a custom hook to use the loading context
export const useLoadingContext = () => useContext(LoadingContext);

// Create a provider component
export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true); // Set initial state to true to show loading screen

  useEffect(() => {
    console.log('LoadingProvider mounted');
    const timer = setTimeout(() => {
      console.log('Setting isLoading to false');
      setIsLoading(false); // Set to false after a delay to hide loading screen
    }, 1000); // Adjust the delay as needed

    return () => {
      console.log('Cleanup');
      clearTimeout(timer); // Clean up the timer when the component unmounts
    };
  }, []); // Only run once when the component mounts

  

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};
