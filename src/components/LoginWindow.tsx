import { useContext } from "react";
import styles from "./LoginWindow.module.css";

import { LoginContext } from '../stores/LoginContext';

export default function LoginWindow() {
    const { setIsUserLoggedIn } = useContext(LoginContext);

    function handleOnSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setIsUserLoggedIn(true);
    }

    return (
        <div className={styles.loginWindow}>
            <form onSubmit={handleOnSubmit}>
                <label htmlFor="userName">Username</label>
                <input id="userName" name="userName"></input>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password"></input>
                <button type="submit">Log in</button>
            </form>
        </div>
    )
}