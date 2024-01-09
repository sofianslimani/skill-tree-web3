import React from "react";
import styles from "./ProfilPage.module.scss";

const ProfilPage = () => {
  return (
    <div className={styles.profilPage}>
      <h1 className={styles.title}>Bienvenue sur la page profil</h1>
      <p>Bienvenue sur mon site web construit avec React et TypeScript.</p>
    </div>
  );
};

export default ProfilPage;
