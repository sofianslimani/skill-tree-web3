import React, { useContext, useEffect, useState } from "react";
import styles from "./ProfilePage.module.scss";
import Rating from "react-rating";
import { MetamaskContext } from "../../App";
import { useParams } from "react-router-dom";
import {
  LoadingBadge,
  ReadyBadge,
} from "../../components/LoaderProfile/LoaderProfile";

const ProfilePage = ({ isOwnProfile = true }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: "",
    bio: "",
    skills: [],
  });
  const [newSkill, setNewSkill] = useState("");
  const metamaskContext = useContext(MetamaskContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [firstNameUser, setFirstNameUser] = useState("");
  const [lastNameUser, setLastNameUser] = useState("");

  const routeParams = useParams();
  const { address } = routeParams;

  useEffect(() => {
    if (address) {
      fetchProfileData();
    } else {
      setProfileData({
        username: "",
        bio: "",
        skills: [],
      });
    }
  }, [address]);

  const checkAndFetchProfile = async () => {
    try {
      setIsLoading(true);
      const profileExists = await metamaskContext.contract.addUser(
        metamaskContext.account,
        "John",
        "Doe"
      );

      if (profileExists) {
        setIsAuthenticated(true);
        fetchProfileData();
      }
    } catch (error) {
      console.error(
        "Erreur lors de la vérification ou de la récupération du profil: ",
        error
      );
    }
  };

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);

      const userProfile = await metamaskContext.contract.getProfile(
        address || metamaskContext.account
      );
      setIsLoading(false);

      setProfileData({
        ...profileData,

        username: userProfile[1] + " " + userProfile[2],
        bio: "Bio à définir",
        skills: userProfile[3].map((skill) => ({
          name: skill[0],
          rating: Number(skill[1]),
          validators: skill[2].map(
            (v) => v.validator[0] + " " + v.validator[1]
          ),
        })),
      });

      setFirstNameUser(userProfile[1]);
      setLastNameUser(userProfile[2]);
    } catch (error) {
      console.error("Erreur lors de la récupération du profil: ", error);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill) return;
    try {
      setIsLoading(true);
      const tx = await metamaskContext.contract.addSkill(newSkill, 1);
      await tx.wait();

      fetchProfileData();
    } catch (error) {
      console.error("Erreur lors de l'ajout d'une compétence: ", error);
    }
  };

  const handleRemoveSkill = async (skillToRemove) => {
    try {
      setIsLoading(true);
      const skillIndex = profileData.skills.findIndex(
        (skill) => skill.name === skillToRemove
      );
      if (skillIndex === -1) return;
      const tx = await metamaskContext.contract.deleteSkill(skillIndex);
      await tx.wait();

      fetchProfileData();
    } catch (error) {
      console.error("Erreur lors de la suppression d'une compétence: ", error);
    }
  };

  const handleSkillRatingChange = async (skillName, newRating) => {
    try {
      setIsLoading(true);
      const skillIndex = profileData.skills.findIndex(
        (skill) => skill.name === skillName
      );
      if (skillIndex === -1) return;
      const tx = await metamaskContext.contract.editSkill(
        skillIndex,
        skillName,
        newRating
      );
      await tx.wait();
      fetchProfileData();
    } catch (error) {
      console.error("Erreur lors de la modification d'une compétence: ", error);
    }
  };

  const handleSkillValidation = async (skillName) => {
    try {
      setIsLoading(true);
      const skillIndex = profileData.skills.findIndex(
        (skill) => skill.name === skillName
      );
      if (skillIndex === -1) return;
      setIsLoading(true);
      const tx = await metamaskContext.contract.addSkillValidation(
        address,
        skillIndex
      );
      await tx.wait();
      fetchProfileData();
    } catch (error) {
      console.error("Erreur lors de la validation d'une compétence: ", error);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const [currentFirstName, currentLastName] = profileData.username.split(" ");

    if (
      firstNameUser !== currentFirstName ||
      lastNameUser !== currentLastName
    ) {
      await handleProfileUpdate();
    }

    setIsEditing(false);
  };

  const handleProfileUpdate = async (event) => {
    try {
      setIsLoading(true);

      const tx = await metamaskContext.contract.editProfile(
        lastNameUser,
        firstNameUser
      );

      await tx.wait();
      fetchProfileData();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil: ", error);
    }
  };
  const handleSkillChange = (event) => {
    setNewSkill(event.target.value);
  };

  const renderValidators = (validators) => {
    if (validators.length <= 4) {
      return validators.join(", ");
    } else {
      return `${validators.slice(0, 4).join(", ")} et ${
        validators.length - 4
      } autres`;
    }
  };

  return (
    <div className={styles.profilePage}>
      {isLoading ? <LoadingBadge /> : <ReadyBadge />}
      <div className={styles.profileHeader}>
        <h1 className={styles.username}>{profileData.username}</h1>
        <p className={styles.bio}>{profileData.bio}</p>
      </div>
      <div className={styles.profileSkills}>
        {profileData.skills.map((skill, index) => (
          <div key={index} className={styles.skillItem}>
            <span>{skill.name}</span>
            <Rating
              initialRating={skill.rating}
              readonly={!isEditing}
              onChange={(newRating) =>
                handleSkillRatingChange(skill.name, newRating)
              }
            />
            {!isEditing && !isOwnProfile && (
              <button onClick={() => handleSkillValidation(skill.name)}>
                {skill.validators.includes("CurrentUser")
                  ? "Annuler"
                  : "Valider"}
              </button>
            )}
            {skill.validators && skill.validators.length > 0 && (
              <div className={styles.validationsCount}>
                {skill.validators.length}
                {skill.validators.length > 1
                  ? " recommandations"
                  : " recommandation"}
              </div>
            )}
            <div className={styles.validators}>
              {renderValidators(skill.validators)}
            </div>
          </div>
        ))}
      </div>
      {isEditing ? (
        <form onSubmit={handleFormSubmit} className={styles.profileForm}>
          <div className={styles.formField}>
            <label htmlFor="username">Nom d'utilisateur</label>
            <input
              className={styles.formField}
              type="text"
              value={firstNameUser}
              onChange={(e) => setFirstNameUser(e.target.value)}
              placeholder="Prénom"
            />
            <input
              className={styles.formField}
              type="text"
              value={lastNameUser}
              onChange={(e) => setLastNameUser(e.target.value)}
              placeholder="Nom de famille"
            />
          </div>
          <div className={styles.formField}>
            <label htmlFor="bio">Biographie</label>
            <textarea
              id="bio"
              value={profileData.bio}
              onChange={(e) =>
                setProfileData({ ...profileData, bio: e.target.value })
              }
            />
          </div>
          <div className={styles.formField}>
            <label htmlFor="newSkill">Ajouter une compétence</label>
            <input
              type="text"
              id="newSkill"
              value={newSkill}
              onChange={handleSkillChange}
            />
            <button type="button" onClick={handleAddSkill}>
              Ajouter
            </button>
          </div>
          {profileData.skills.map((skill, index) => (
            <div key={index} className={styles.skillItem}>
              {skill.name}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill.name)}
              >
                Retirer
              </button>
            </div>
          ))}
          <div className={styles.formActions}>
            <button type="submit">Enregistrer les modifications</button>
            <button type="button" onClick={handleCancelClick}>
              Annuler
            </button>
          </div>
        </form>
      ) : isOwnProfile ? (
        <>
          {isAuthenticated && (
            <button onClick={handleEditClick} className={styles.editButton}>
              Modifier le profil
            </button>
          )}
          {!isAuthenticated && (
            <button
              onClick={checkAndFetchProfile}
              className={styles.editButton}
            >
              Se connecter
            </button>
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ProfilePage;
