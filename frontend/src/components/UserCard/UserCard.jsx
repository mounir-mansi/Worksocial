import React from "react";
import PropTypes from "prop-types"; // Importez PropTypes depuis la bibliothèque prop-types
import "./UserCard.css";

function UserCard({ user }) {
  return (
    <div className="user-card">
      <img
        src={`http://localhost:5000/${user.ProfileImage}`}
        alt={user.FirstName}
      />
      <div className="user-info">
        <h2>
          {user.FirstName} {user.LastName}
        </h2>
        <p>Age: {user.Age}</p>
        <p>Genre: {user.Gender}</p>
        {/* <p>Email: {user.Email}</p>
        <p>Adresse: {user.Address}</p>
        <p>Date de naissance: {user.BirthDate}</p> */}
      </div>
    </div>
  );
}

// Spécifiez les validations de props pour votre composant
UserCard.propTypes = {
  user: PropTypes.shape({
    ProfileImage: PropTypes.string,
    FirstName: PropTypes.string,
    LastName: PropTypes.string,
    Age: PropTypes.number,
    Gender: PropTypes.string,
    // Email: PropTypes.string,
    // Address: PropTypes.string,
    // BirthDate: PropTypes.string,
    // // Ajoutez d'autres validations de props ici si nécessaire
  }).isRequired, // Vous pouvez également spécifier isRequired si la prop est obligatoire
};

export default UserCard;
