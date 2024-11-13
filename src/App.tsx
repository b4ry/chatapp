import React from 'react';
import './variables.css';

import styles from "./App.module.css";
import Header from './components/Header';
import Chat from './components/Chat';
import { useAuth } from './stores/AuthContext';
import LoginWindow from './components/LoginWindow';

function App() {
  const { isAuthenticated } = useAuth();

  let content = <div className={styles.app}>
    <Header />
    <Chat />
  </div>;

  if(!isAuthenticated) {
    content = <LoginWindow />;
  }
  
  return content;
}

export default App;
