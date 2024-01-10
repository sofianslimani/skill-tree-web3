import React, { useState } from "react";
import styles from "./ProfilePage.module.scss";
import Rating from "react-rating";

const initialProfileData = {
  username: "Jane Doe",
  bio: "Développeuse Frontend | Spécialiste React & SASS | Passionnée par l'UI/UX",
  skills: [
    {
      name: "React",
      rating: 3,
      validators: ["User1", "User2", "User2", "User2", "User2", "User2"],
    },
    { name: "JavaScript", rating: 4, validators: [] },
    { name: "SASS", rating: 5, validators: ["User3"] },
    { name: "UI/UX Design", rating: 3, validators: [] },
  ],
};

const ProfilePage = ({ isOwnProfile = true }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(initialProfileData);
  const [newSkill, setNewSkill] = useState("");

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setIsEditing(false);
  };

  const handleSkillChange = (event) => {
    setNewSkill(event.target.value);
  };

  const handleAddSkill = () => {
    if (
      newSkill &&
      !profileData.skills.find((skill) => skill.name === newSkill)
    ) {
      setProfileData({
        ...profileData,
        skills: [
          ...profileData.skills,
          { name: newSkill, rating: 0, validators: [] },
        ],
      });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter(
        (skill) => skill.name !== skillToRemove
      ),
    });
  };

  const handleSkillRatingChange = (skillName, newRating) => {
    const updatedSkills = profileData.skills.map((skill) => {
      if (skill.name === skillName) {
        return { ...skill, rating: newRating };
      }
      return skill;
    });
    setProfileData({ ...profileData, skills: updatedSkills });
  };

  const handleSkillValidation = (skillName) => {
    const updatedSkills = profileData.skills.map((skill) => {
      if (skill.name === skillName) {
        if (skill.validators.includes("CurrentUser")) {
          return {
            ...skill,
            validators: skill.validators.filter((v) => v !== "CurrentUser"),
          };
        } else {
          return {
            ...skill,
            validators: [...skill.validators, "CurrentUser"],
          };
        }
      }
      return skill;
    });
    setProfileData({ ...profileData, skills: updatedSkills });
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
              type="text"
              id="username"
              value={profileData.username}
              onChange={(e) =>
                setProfileData({ ...profileData, username: e.target.value })
              }
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
      ) : (
        <button onClick={handleEditClick} className={styles.editButton}>
          Modifier le profil
        </button>
      )}
    </div>
  );
};

export default ProfilePage;
