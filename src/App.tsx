import React, { useContext } from 'react';
import './variables.css';

import styles from "./App.module.css";
import Header from './components/Header';
import Chat from './components/Chat';
import { LoginContext } from './stores/LoginContext';
import LoginWindow from './components/LoginWindow';

function App() {
  const { isUserLoggedIn } = useContext(LoginContext);

  let content = <div className={styles.app}>
    <Header />
    <Chat />
  </div>;

  if(!isUserLoggedIn) {
    content = <LoginWindow />;
  }
  
  return content;
}

export default App;
