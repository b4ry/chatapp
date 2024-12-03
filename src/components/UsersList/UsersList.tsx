import { useState } from "react";
import { User } from "./User";
import styles from "./UsersList.module.css";

export default function UsersList({ users } : { users: User[] }) {
    const [activeUser, setActiveUser] = useState( users.find(user => user.username === "Server"));

    function handleOnClick(user: User) {
        setActiveUser(user);
    }

    return (
        <ul className={styles.usersList}>
            { users.map(user =>
                <button
                    key={user.username}
                    className={`${styles.user} ${user.username === activeUser?.username ? styles.isActive : ''}`}
                    onClick={() => handleOnClick(user)}>
                    {user.username}
                </button>
            )}
        </ul>
    );
}