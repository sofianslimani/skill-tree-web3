import React, { useState } from "react";
import styles from "./ProfilePage.module.scss";
import { FaCode, FaPaintBrush, FaCog } from "react-icons/fa";

const initialProfileData = {
  username: "Jane Doe",
  bio: "Développeuse Frontend | Spécialiste React & SASS | Passionnée par l'UI/UX",
  skills: ["React", "JavaScript", "SASS", "UI/UX Design"],
};

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(initialProfileData);
  const [newSkill, setNewSkill] = useState("");

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Logique de mise à jour des données
    setIsEditing(false);
  };

  const handleSkillChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewSkill(event.target.value);
  };

  const handleAddSkill = () => {
    if (newSkill && !profileData.skills.includes(newSkill)) {
      setProfileData({
        ...profileData,
        skills: [...profileData.skills, newSkill],
      });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter((skill) => skill !== skillToRemove),
    });
  };
  return (
    <div className={styles.profilePage}>
      <div className={styles.profileHeader}>
        <h1 className={styles.username}>{profileData.username}</h1>
        <p className={styles.bio}>{profileData.bio}</p>
      </div>
      <div className={styles.profileSkills}>
        {profileData.skills.map((skill) => (
          <div key={skill} className={styles.skill}>
            <span>{skill}</span>
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
              {skill}
              <button type="button" onClick={() => handleRemoveSkill(skill)}>
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
