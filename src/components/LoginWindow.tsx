import { useContext, useRef, useState } from "react";
import styles from "./LoginWindow.module.css";

import { LoginContext } from '../stores/LoginContext';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%])[A-Za-z\d!@#$%]{8,}$/;

export default function LoginWindow() {
    const { setIsUserLoggedIn } = useContext(LoginContext);

    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionErrorMessage, setSubmissionErrorMessage] = useState("");

    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);

    async function handleOnSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        setSubmissionErrorMessage("");

        const formData = new FormData(event.currentTarget);
        const entries = Object.fromEntries(formData.entries());

        const url = isRegistering
            ? process.env.REACT_APP_CERBERUS_API_AUTH_REGISTER_URL
            : process.env.REACT_APP_CERBERUS_API_AUTH_LOGIN_URL;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(entries),
            });

            if (response.ok) {
                setIsUserLoggedIn(true);
            } else {
                throw new Error(`${response.statusText}`);
            }
        } catch (error) {
            setIsUserLoggedIn(false);
            setSubmissionErrorMessage(`Failed to submit form. ${error}`);
        } finally {
            setIsSubmitting(false);
        }
    }

    function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
        const password = event.target.value;

        setIsPasswordValid(passwordRegex.test(password));

        if (confirmPasswordRef.current?.value === password) {
            setIsConfirmPasswordValid(true);
        } else {
            setIsConfirmPasswordValid(false);
        }
    }

    function handleConfirmPasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
        const confirmPassword = event.target.value;

        if (passwordRef.current?.value === confirmPassword) {
            setIsConfirmPasswordValid(true);
        } else {
            setIsConfirmPasswordValid(false);
        }
    }

    function toggleWindow() {
        setIsRegistering((prevState) => !prevState);
        setSubmissionErrorMessage(""); // Clear errors when switching
    }

    const renderForm = () => (
        <div className={styles.loginWindow}>
            <form onSubmit={handleOnSubmit}>
                <label htmlFor="userName">Username</label>
                <input id="userName" name="userName" required />

                <label htmlFor="password">Password</label>
                <input
                    ref={passwordRef}
                    type="password"
                    id="password"
                    name="password"
                    onChange={handlePasswordChange}
                    required
                />
                {!isPasswordValid && (
                    <span className={styles.validationError}>
                        Password should have at least 8 characters, one small and one big letter, one number, and a special character (!@#$%)
                    </span>
                )}

                {isRegistering && (
                    <>
                        <label htmlFor="confirmPassword">Confirm password</label>
                        <input
                            ref={confirmPasswordRef}
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            onChange={handleConfirmPasswordChange}
                            required
                        />
                        {!isConfirmPasswordValid && (
                            <span className={styles.validationError}>
                                Passwords do not match!
                            </span>
                        )}
                    </>
                )}

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (isRegistering ? "...registering" : "...logging in") : isRegistering ? "Register" : "Log in"}
                </button>
                <p onClick={toggleWindow}>
                    {isRegistering ? "back to login!" : "or register!"}
                </p>
            </form>
            {submissionErrorMessage && <span className={styles.requestErrorMessage}>{submissionErrorMessage}</span>}
        </div>
    );

    return renderForm();
}
