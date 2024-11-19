import { User } from "./User";
import styles from "./UsersList.module.css";

export default function UsersList({ users } : { users: User[] }) {
    return (
        <ul className={styles.usersList}>
            { users.map(user => <button key={user.username} className={styles.user}>{user.username}</button>)}
        </ul>
    );
}