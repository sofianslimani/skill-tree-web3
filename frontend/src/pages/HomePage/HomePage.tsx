import { useContext, useState, useEffect } from "react";
import styles from "./HomePage.module.scss";
import { MetamaskContext } from "../../App";
import { Link } from "react-router-dom";
import { MetamaskContextType } from "../../types/metamask";

const fakeUsers = [
  { id: 1, username: "UserOne", profession: "Développeur Frontend" },
  { id: 2, username: "UserTwo", profession: "Concepteur UX" },
  { id: 3, username: "UserTwo", profession: "Concepteur UX" },
  { id: 4, username: "UserTwo", profession: "Concepteur UX" },
  { id: 5, username: "UserTwo", profession: "Concepteur UX" },
];

interface User {
  lastName: string;
  firstname: string;
  skills: string[];
}

const HomePage = () => {
  const metamaskContext: MetamaskContextType = useContext(MetamaskContext)!;
  const [users, setUsers] = useState<User[]>([]);

  const mapUsersProfiles = (users: any) => {
    let tmp = JSON.parse(JSON.stringify(users));

    return tmp.map((user: any) => {
      return {
        lastName: user[0],
        firstname: user[1],
        skills: user[2],
      };
    });
  };

  const getUsers = async () => {
    return mapUsersProfiles(await metamaskContext.contract.listProfiles());
  };

  useEffect(() => {
    getUsers().then((users) => {
      setUsers(users);
    });
  }, []);

  return (
    <div className={styles.homePage}>
      <h1>Liste des Utilisateurs</h1>
      <ul className={styles.userList}>
        {users.map((user, i) => (
          <li key={i} className={styles.userItem}>
            <Link to={`/profile/${i}`} className={styles.userLink}>
              {user.firstname} {user.lastName}
            </Link>
            <div className={styles.profession}>
              {user.skills.map((skill, i) => (
                <>
                  {i > 0 ? ", " : ""}
                  {skill}
                </>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
