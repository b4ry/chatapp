import { useAuth } from "../stores/AuthContext";
import styles from "./Header.module.css";

export default function Header() {
    const { logout } = useAuth();

    return (
        <header className={styles.header}>
            <button onClick={ logout } className={styles.logout}>LOGOUT</button>
        </header>
    );
}