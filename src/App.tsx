import React from 'react';
import './variables.css';

import styles from "./App.module.css";
import Header from './components/Header';
import Chat from './components/Chat';

function App() {
  return (
    <div className={styles.app}>
      <Header />
      <Chat />
    </div>
  );
}

export default App;
