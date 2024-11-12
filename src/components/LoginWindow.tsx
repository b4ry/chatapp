import { useContext, useRef, useState } from "react";
import styles from "./LoginWindow.module.css";

import { LoginContext } from '../stores/LoginContext';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%])[A-Za-z\d!@#$%]{8,}$/;

export default function LoginWindow() {
    const { setIsUserLoggedIn } = useContext(LoginContext);

    const [ isPasswordValid, setIsPasswordValid ] = useState<boolean>(true);
    const [ isConfirmPasswordValid, setIsConfirmPasswordValid ] = useState<boolean>(true);
    const [ isRegistering, setIsRegistering ] = useState(false);
    const [ isSubmitting, setIsSubmitting ] = useState(false);
    const [ submissionErrorMessage, setSubmissionErrorMessage ] = useState("");

    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);

    async function handleOnSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setIsSubmitting(true);
        setSubmissionErrorMessage("");

        const formData = new FormData(event.currentTarget);
        const entries = Object.fromEntries(formData.entries());

        try {
            const url = isRegistering ? process.env.REACT_APP_CERBERUS_API_AUTH_REGISTER_URL : process.env.REACT_APP_CERBERUS_API_AUTH_LOGIN_URL;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(entries),
            });

            if (response.ok) {
                setIsUserLoggedIn(true);
            } else {
                setIsUserLoggedIn(false);
                setSubmissionErrorMessage(`Failed to submit form. Reason: ${response.statusText}`);
            }
        } catch (error) {   
            setIsUserLoggedIn(false);
            setSubmissionErrorMessage(`Failed to submit form. Error: ${error}`);
        } finally {
            setIsSubmitting(false);
        }
    }

    function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
        const input = event.target.value;

        if(input === confirmPasswordRef.current?.value) {
            setIsConfirmPasswordValid(true);
        } else {
            setIsConfirmPasswordValid(false);
        }

        if (passwordRegex.test(input)) {
            setIsPasswordValid(true);
        } else {
            setIsPasswordValid(false);
        }
    }

    function handleConfirmPasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
        const input = event.target.value;

        if (input === passwordRef.current?.value) {
            setIsConfirmPasswordValid(true);
        } else {
            setIsConfirmPasswordValid(false);
        }
    }

    function handleSwitchingWindow() {
        setIsRegistering(prevState => !prevState);
        setSubmissionErrorMessage("");
    }

    let content = 
        <div className={styles.loginWindow}>
            <form onSubmit={handleOnSubmit}>
                <label htmlFor="userName">Username</label>
                <input id="userName" name="userName"></input>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password"></input>
                <button type="submit" disabled={isSubmitting}>{ isSubmitting ? "...submitting" : "Log in" }</button>
                <p onClick={handleSwitchingWindow}>or Register!</p>
            </form>
            <span className={styles.requestErrorMessage}>{submissionErrorMessage}</span>
        </div>;

    if (isRegistering) {
        content = 
            <div className={styles.loginWindow}>
                <form onSubmit={handleOnSubmit}>
                <label htmlFor="userName">Username</label>
                <input id="userName" name="userName"></input>
                <label htmlFor="password">Password</label>
                <input ref={passwordRef} type="password" id="password" name="password" onChange={ handlePasswordChange }></input>
                { 
                    !isPasswordValid && 
                    <span className={styles.validationError}>
                        Password should have at least 8 characters, one small and one big letter, one number and a special character (!@#$%)
                    </span> 
                }
                <label htmlFor="confirmPassword">Confirm password</label>
                <input ref={confirmPasswordRef} type="password" id="confirmPassword" name="confirmPassword" onChange={ handleConfirmPasswordChange }></input>
                { 
                    !isConfirmPasswordValid && 
                    <span className={styles.validationError}>
                        Passwords do not match!
                    </span> 
                }
                <button type="submit" disabled={isSubmitting}>{ isSubmitting ? "...submitting" : "Register" }</button>
                <p onClick={handleSwitchingWindow}>come back to Login!</p>
            </form>
            <span className={styles.requestErrorMessage}>{submissionErrorMessage}</span>
        </div>;
    }

    return content;
}