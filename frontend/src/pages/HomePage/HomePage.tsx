import React, { useContext } from "react";
import styles from "./HomePage.module.scss";
import { MetamaskContext, MetamaskContextType } from "../../App";
import { Link } from "react-router-dom";

const fakeUsers = [
  { id: 1, username: "UserOne", profession: "Développeur Frontend" },
  { id: 2, username: "UserTwo", profession: "Concepteur UX" },
  { id: 3, username: "UserTwo", profession: "Concepteur UX" },
  { id: 4, username: "UserTwo", profession: "Concepteur UX" },
  { id: 5, username: "UserTwo", profession: "Concepteur UX" },
];

const HomePage = () => {
  const metamaskContext: MetamaskContextType = useContext(MetamaskContext)!;

  console.log(metamaskContext);
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
