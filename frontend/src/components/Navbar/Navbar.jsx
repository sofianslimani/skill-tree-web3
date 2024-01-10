import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.scss";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link to="/" className={styles.navLink}>
          Liste des utilisateurs
        </Link>
        <Link to="/profile" className={styles.navLink}>
          Mon Profil
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
