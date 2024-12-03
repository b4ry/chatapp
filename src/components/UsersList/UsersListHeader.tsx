import { useEffect, useState } from "react";
import { User } from "./User";
import styles from "./UsersListHeader.module.css";
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function UsersListHeader({ users, onFilterUsers }: { users: User[], onFilterUsers: React.Dispatch<React.SetStateAction<User[]>>}) {
    const [searchTerm, setSearchTerm] = useState("");
    
    function handleSearchTermChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSearchTerm(event.target.value.toLocaleLowerCase());
    }

    useEffect(() => {
        const filteredUsers = users.filter(user => user.username.toLocaleLowerCase().includes(searchTerm));

        onFilterUsers(filteredUsers);
    }, [ users, searchTerm, onFilterUsers ]);

    return (
        <div className={styles.usersListHeader}>
            <p>Chats</p>
            <div className={styles.searchBox}>
                <MagnifyingGlassIcon className={`search-icon ${styles.magnifyingGlass}`} />
                <input className={styles.searchInput} placeholder="Search..." onChange={handleSearchTermChange}/>
            </div>
        </div>
    );
}