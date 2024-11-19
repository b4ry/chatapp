import styles from "./UsersListSection.module.css";

import UsersListHeader from "./UsersListHeader";
import UsersList from "./UsersList";
import { useEffect, useState } from "react";
import { onGetUsers, onUserJoinsChat } from "../../services/ChatHubService";
import { User } from "./User";

export default function UsersListSection() {
    const [currentUsers, setCurrentUsers] = useState<User[]>([]);

    useEffect(() => {
        onGetUsers((users: string[]) => {
            const mappedUsers = users.map(username => ({ username } as User));
            
            setCurrentUsers(prev => [ ...mappedUsers ]);
        });

        onUserJoinsChat((username: string) => {
            setCurrentUsers(prev => [ ...prev, { username } as User ]);
        });
    }, []);

    return (
        <section className={styles.usersList}>
            <UsersListHeader />
            <UsersList users={currentUsers}/>
        </section>
    )
}