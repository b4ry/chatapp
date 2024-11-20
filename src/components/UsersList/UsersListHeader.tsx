import styles from "./UsersListHeader.module.css";
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function UsersListHeader() {
    return (
        <div className={styles.usersListHeader}>
            <p>Chats</p>
            <div className={styles.searchBox}>
                <MagnifyingGlassIcon className={`search-icon ${styles.magnifyingGlass}`} />
                <input className={styles.searchInput} placeholder="Search" />
            </div>
        </div>
    );
}