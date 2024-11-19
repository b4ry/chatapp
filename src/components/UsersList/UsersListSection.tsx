import styles from "./UsersListSection.module.css";

import UsersListHeader from "./UsersListHeader";
import UsersList from "./UsersList";
import { useEffect } from "react";
import { onUserJoinsChat } from "../../services/ChatHubService";

export default function UsersListSection() { 
    useEffect(() => {
        onUserJoinsChat((username: string) => {
            console.log("New user joined the chat:", username);
        });

    }, []);

    return (
        <section className={styles.usersList}>
            <UsersListHeader />
            <UsersList />
        </section>
    )
}