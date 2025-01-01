import React from 'react';
import { useLoadingContext } from '../context/loadingContext';
import styles from './LoadingScreen.module.css'

const LoadingScreen = () => {
  const { isLoading } = useLoadingContext();

  if (!isLoading) return null; // Don't show the loading screen once isLoading is false

  return (
    <div className={styles["loading-screen"]}>
      <h2>Loading...</h2>
    </div>
  );
};

export default LoadingScreen;
