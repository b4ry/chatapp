import styles from "./UsersListSection.module.css";

import UsersListHeader from "./UsersListHeader";
import UsersList from "./UsersList";

export default function UsersListSection() { 
    return (
        <section className={styles.usersList}>
            <UsersListHeader />
            <UsersList />
        </section>
    )
}