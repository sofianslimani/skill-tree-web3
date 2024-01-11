import styles from "./LoaderProfile.module.scss";

export const LoadingBadge = () => (
  <div className={styles.loadingBadge}>
    <div className={styles.spinner}></div>
    Chargement...
  </div>
);

export const ReadyBadge = () => <div className={styles.readyBadge}>Prêt</div>;
