import { User } from "./User";
import styles from "./UsersList.module.css";
import { useChatMessagesContext } from "../../stores/ChatMessagesContext";

export default function UsersList({ users } : { users: User[] }) {
    console.log("UserList");
    const { currentChatUser, unreadMessages, setChatUser } = useChatMessagesContext();

    function handleOnClick(user: User) {
        setChatUser(user.username);
    }

    return (
        <ul className={styles.usersList}>
            { users.map(user =>
                <button
                    key={user.username}
                    className={`${styles.user} ${user.username === currentChatUser ? styles.isActive : ''}`}
                    onClick={() => handleOnClick(user)}>
                    { unreadMessages.has(user.username) ? user.username + " *" : user.username }
                </button>
            )}
        </ul>
    );
}