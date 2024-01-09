import React from "react";
import styles from "./HomePage.module.scss";

const HomePage = () => {
  return (
    <div className={styles.homePage}>
      <h1 className={styles.title}>Bienvenue sur la page d'accueil</h1>
      <p>Bienvenue sur mon site web construit avec React et TypeScript.</p>
    </div>
  );
};

export default HomePage;
