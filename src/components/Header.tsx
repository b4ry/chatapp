import { useAuth } from "../stores/AuthContext";
import styles from "./Header.module.css";

export default function Header() {
    console.log("Header");

    const { logout } = useAuth();
    const loggedInAsUsername = localStorage.getItem("username");

    return (
        <header className={styles.header}>
            <p className={styles.p}>Logged in as {loggedInAsUsername}</p>
            <button onClick={logout} className={styles.logout}>Logout</button>
        </header>
    );
}