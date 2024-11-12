import { useContext, useState } from "react";
import styles from "./LoginWindow.module.css";

import { LoginContext } from '../stores/LoginContext';

export default function LoginWindow() {
    const { setIsUserLoggedIn } = useContext(LoginContext);
    const [ isRegistering, setIsRegistering ] = useState(false);
    const [ isSubmitting, setIsSubmitting ] = useState(false);
    const [ submissionMessage, setSubmissionMessage ] = useState("");

    async function handleOnSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setIsSubmitting(true);
        setSubmissionMessage("");

        const formData = new FormData(event.currentTarget);
        const entries = Object.fromEntries(formData.entries());

        try {
            const response = await fetch("http://localhost:5126/api/auth/login", {
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
                setSubmissionMessage(`Failed to submit form. Reason: ${response.statusText}`);
            }
        } catch (error) {   
            setIsUserLoggedIn(false);
            setSubmissionMessage(`Failed to submit form. Error: ${error}`);
        } finally {
            setIsSubmitting(false);
        }
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
                <button type="submit" disabled={isSubmitting}>{ isSubmitting ? "...submitting" : (isRegistering ? "Register" : "Log in") }</button>
                <p onClick={() => setIsRegistering((prevState) => !prevState)}>{ isRegistering ? "come back to Login!" : "or Register!" }</p>
            </form>
            <span>{submissionMessage}</span>
        </div>
    )
}