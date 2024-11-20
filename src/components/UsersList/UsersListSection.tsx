import styles from "./UsersListSection.module.css";

import UsersListHeader from "./UsersListHeader";
import UsersList from "./UsersList";
import { useEffect, useState } from "react";
import { onGetUsers, onGetUsersUnsubscribe, onUserJoinsChat, onUserJoinsChatUnsubscribe, onUserLogsOut, onUserLogsOutUnsubscribe } from "../../services/ChatHubService";
import { User } from "./User";

export default function UsersListSection() {
    const [currentUsers, setCurrentUsers] = useState<User[]>([ { username: "Server" }]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([ { username: "Server" }]);

    useEffect(() => {
        onGetUsers((users: string[]) => {
            const mappedUsers = users.map(username => ({ username } as User));
            
            setCurrentUsers(prev => [ ...prev, ...mappedUsers ]);
            setFilteredUsers(prev => [ ...prev, ...mappedUsers ]);
        });

        onUserJoinsChat((joininUsername: string) => {
            setCurrentUsers(prev => [ ...prev, { username: joininUsername } as User ]);
        });

        onUserLogsOut((disconnectingUsername: string) => {
            setCurrentUsers(prev => [ ...prev.filter(user => user.username !== disconnectingUsername) ]);
        });

        return () => {
            onGetUsersUnsubscribe();
            onUserJoinsChatUnsubscribe();
            onUserLogsOutUnsubscribe();
        }
    }, []);

    return (
        <section className={styles.usersList}>
            <UsersListHeader users={currentUsers} onFilterUsers={setFilteredUsers}/>
            <UsersList users={filteredUsers}/>
        </section>
    )
}