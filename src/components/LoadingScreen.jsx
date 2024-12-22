import React from 'react';
import { useLoading } from '../context/loadingContext';
import styles from './LoadingScreen.module.css'

const LoadingScreen = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null; // Don't show the loading screen once isLoading is false

  return (
    <div className={styles["loading-screen"]}>
      <h2>Loading...</h2>
      {/* You can add a spinner or animation here */}
    </div>
  );
};

export default LoadingScreen;
