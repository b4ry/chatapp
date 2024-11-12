import { useContext, useState } from "react";
import styles from "./LoginWindow.module.css";

import { LoginContext } from '../stores/LoginContext';

export default function LoginWindow() {
    const { setIsUserLoggedIn } = useContext(LoginContext);
    const [ isRegistering, setIsRegistering ] = useState(false);

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
                { isRegistering && <>
                        <label htmlFor="confirmPassword">Confirm password</label>
                        <input type="password" id="confirmPassword" name="confirmPassword"></input>
                    </>
                }
                <button type="submit">{ isRegistering ? "Register" : "Log in" }</button>
                <p onClick={() => setIsRegistering((prevState) => !prevState)}>{ isRegistering ? "come back to Login!" : "or Register!" }</p>
            </form>
        </div>
    )
}