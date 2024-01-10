import React from "react";
import { Link } from "react-router-dom";
import styles from "./HomePage.module.scss";

const fakeUsers = [
  { id: 1, username: "UserOne", profession: "Développeur Frontend" },
  { id: 2, username: "UserTwo", profession: "Concepteur UX" },
];

const HomePage = () => {
  return (
    <div className={styles.homePage}>
      <h1>Liste des Utilisateurs</h1>
      <ul className={styles.userList}>
        {fakeUsers.map((user) => (
          <li key={user.id} className={styles.userItem}>
            <Link to={`/profile/${user.id}`} className={styles.userLink}>
              {user.username}
            </Link>
            <div className={styles.profession}>{user.profession}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
