import { useState } from "react";
import { Channel } from "./User";
import styles from "./UsersList.module.css";

export default function UsersList({ users } : { users: Channel[] }) {
    const [activeUser, setActiveUser] = useState( users.find(user => user.isActive));

    function handleOnClick(user: Channel) {
        activeUser!.isActive = false;
        user.isActive = true;

        setActiveUser(user);
    }

    return (
        <ul className={styles.usersList}>
            { users.map(user =>
                <button
                    key={user.username}
                    className={`${styles.user} ${user.isActive ? styles.isActive : ''}`}
                    onClick={() => handleOnClick(user)}>
                    {user.username}
                </button>
            )}
        </ul>
    );
}