import React, { useState } from 'react';
import './ProfileCard.css';

function ProfileCard(props) {
  const { name, role, avatar, skills, location } = props;
  const [showDetails, setShowDetails] = useState(false);
  const [likes, setLikes] = useState(0);        // Exercise 2
  const [hovered, setHovered] = useState(false); // Exercise 3

  const toggleDetails = () => setShowDetails(!showDetails);

  return (
    <div className="profile-card">
      <div className="profile-header">
        {/* Exercise 3 - hover border color */}
        <img
          src={avatar}
          alt={`${name}'s avatar`}
          className="avatar"
          style={{ borderColor: hovered ? '#4285f4' : '#fff' }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        />
        <h2>{name}</h2>
        <p>{role}</p>
        {/* Exercise 1 - location field */}
        {location && <p className="location">📍 {location}</p>}
      </div>

      <button onClick={toggleDetails}>
        {showDetails ? "Hide Skills" : "Show Skills"}
      </button>

      {/* Exercise 2 - like button */}
      <button className="like-btn" onClick={() => setLikes(likes + 1)}>
        ❤️ {likes} {likes === 1 ? "Like" : "Likes"}
      </button>

      {showDetails && (
        <div className="skills-section">
          <h3>Skills</h3>
          <div className="skills-container">
            {skills.map((skill, index) => (
              <span key={index} className="skill-tag">{skill}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

ProfileCard.defaultProps = {
  avatar: "https://i.pravatar.cc/100",
  skills: [],
};

export default ProfileCard;