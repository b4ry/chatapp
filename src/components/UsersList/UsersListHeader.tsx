import styles from "./UsersListHeader.module.css";

export default function UsersListHeader() {
    return (
        <div className={styles.usersListHeader}>
            <p>Chats</p>
            <input placeholder="Search"></input>
        </div>
    );
}