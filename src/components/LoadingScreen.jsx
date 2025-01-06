import React, { useEffect } from 'react';
import { useLoadingContext } from '../context/loadingContext';
import styles from './LoadingScreen.module.css'

const LoadingScreen = () => {
  const { isLoading } = useLoadingContext();

  useEffect(() => {
    // document.body.style.overflow = isLoading ? 'hidden' : 'auto'; // Disable scrolling when loading
    if(isLoading) {
      console.log('Loading screen is active');
      console.log(isLoading);
    }
  }, [isLoading]);

  if (!isLoading) return null; // Don't show the loading screen once isLoading is false

  return (
    <div className={styles["loading-screen"]}>
      <h2>Loading...</h2>
    </div>
  );
};

export default LoadingScreen;
