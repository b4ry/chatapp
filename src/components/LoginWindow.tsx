import { useCallback, useState } from "react";
import styles from "./LoginWindow.module.css";

import { useAuthContext } from '../stores/AuthContext';
import { AuthToken } from "../dtos/AuthToken";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%])[A-Za-z\d!@#$%]{8,}$/;

export default function LoginWindow() {
    console.log("LoginWindow");
    const { login, setPassword } = useAuthContext();

    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionErrorMessage, setSubmissionErrorMessage] = useState<string | null>(null);
    const [localPassword, setLocalPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleOnSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setSubmissionErrorMessage(null);

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
                const authToken: AuthToken = await response.json();
                
                login(authToken);
                localStorage.setItem("username", entries.username.toString())
                setPassword(entries.password.toString());
            } else {
                throw new Error(`${response.statusText}`);
            }
        } catch (error) {
            setSubmissionErrorMessage(`Failed to submit form. ${error}`);
        } finally {
            setIsSubmitting(false);
        }
    }, [isRegistering, login, setPassword]);

    const handlePasswordChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;

        setLocalPassword(input);
        setIsPasswordValid(passwordRegex.test(input));

        if (confirmPassword === input) {
            setIsConfirmPasswordValid(true);
        } else {
            setIsConfirmPasswordValid(false);
        }
    }, [confirmPassword]);

    const handleConfirmPasswordChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        
        setConfirmPassword(input);

        if (localPassword === input) {
            setIsConfirmPasswordValid(true);
        } else {
            setIsConfirmPasswordValid(false);
        }
    }, [localPassword]);

    const toggleWindow = useCallback(() => {
        setIsRegistering((prevState) => !prevState);
        setSubmissionErrorMessage(null);
        setLocalPassword("");
        setConfirmPassword("");
        setIsPasswordValid(true);
        setIsConfirmPasswordValid(true);
    }, []);

    const renderForm = () => (
        <div className={styles.loginWindow}>
            <form className={styles.form} onSubmit={handleOnSubmit}>
                <label className={styles.label} htmlFor="username">Username</label>
                <input className={styles.input} id="username" name="username" required />

                <label className={styles.label} htmlFor="password">Password</label>
                <input
                    className={styles.input}
                    type="password"
                    id="password"
                    name="password"
                    onChange={handlePasswordChange}
                    value={localPassword}
                    required
                />
                { (isRegistering && !isPasswordValid) && (
                    <span className={styles.validationError}>
                        Password should have at least 8 characters, one small and one big letter, one number, and a special character (!@#$%)
                    </span>
                )}

                {isRegistering && (
                    <>
                        <label className={styles.label} htmlFor="confirmPassword">Confirm password</label>
                        <input
                            className={styles.input}
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            onChange={handleConfirmPasswordChange}
                            value={confirmPassword}
                            required
                        />
                        {!isConfirmPasswordValid && (
                            <span className={styles.validationError}>
                                Passwords do not match!
                            </span>
                        )}
                    </>
                )}

                <button className={styles.button} type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (isRegistering ? "...registering" : "...logging in") : isRegistering ? "Register" : "Log in"}
                </button>
                <p className={styles.p} onClick={toggleWindow}>
                    {isRegistering ? "back to login!" : "or register!"}
                </p>
            </form>
            {submissionErrorMessage && <span className={styles.requestErrorMessage}>{submissionErrorMessage}</span>}
        </div>
    );

    return renderForm();
}
