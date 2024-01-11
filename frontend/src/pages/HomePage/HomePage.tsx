import { useContext, useState, useEffect } from "react";
import styles from "./HomePage.module.scss";
import { MetamaskContext } from "../../App";
import { Link } from "react-router-dom";
import { MetamaskContextType } from "../../types/metamask";

interface User {
  adress: string;
  lastName: string;
  firstname: string;
  skills: string[];
}

const HomePage = () => {
  const metamaskContext: MetamaskContextType = useContext(MetamaskContext)!;
  const [users, setUsers] = useState<User[]>([]);

  const mapUsersProfiles = (users: any) => {
    return users.map((user: any) => {
      return {
        adress: user[0],
        lastName: user[1],
        firstname: user[2],
        skills: user[3].map((skill: any) => skill[0]),
      };
    });
  };

  const getUsers = async () => {
    return mapUsersProfiles(await metamaskContext.contract.listProfiles());
  };

  useEffect(() => {
    getUsers().then((users) => {
      console.log(users);
      setUsers(users);
    });
  }, []);

  return (
    <div className={styles.homePage}>
      <h1>Liste des Utilisateurs</h1>
      <ul className={styles.userList}>
        {users.map((user) => (
          <li key={user.adress} className={styles.userItem}>
            <Link to={`/profile/${user.adress}`} className={styles.userLink}>
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
