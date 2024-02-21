import React, { useState } from "react";
import "./ConnexionScreen.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/useConnecte";
import { hostname } from "../../HostnameConnect/Hostname";

function ConnexionScreen() {
  // React States
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { mail, pass } = event.target.elements;
    const emailValue = mail.value;
    const passwordValue = pass.value;
    const formData = {
      "Email": emailValue,
      "Password": passwordValue,
    }
    console.info(formData);
    try {
      const response = await fetch(`${hostname}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: formData,
      });
      
      const data = await response.json();

      if (response.ok) {
        const { authToken, user } = data;
        localStorage.setItem("userToken", authToken);
        localStorage.setItem("userId", user.User_ID);
        localStorage.setItem("username", user.Username);
        localStorage.setItem("firstName", data.user.FirstName);
        auth.login(authToken, user.User_ID);
        localStorage.setItem("user", JSON.stringify(user));
        setIsSubmitted(true);
        navigate("/dashboard");
      } else {
        setErrorMessages({
          name: "pass",
          message: data.message || "Erreur de connexion",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
    }
  };

  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error-message">{errorMessages.message}</div>
    );

  const renderForm = (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="connexion-form">
        <div className="form-group">
          <label htmlFor="mail">eMail</label>
          <input type="email" id="mail" name="mail" required />
          {renderErrorMessage("mail")}
        </div>
        <div className="form-group">
          <label htmlFor="pass">Mot de passe</label>
          <input type="password" id="pass" name="pass" required />
          {renderErrorMessage("pass")}
        </div>
        <a href="/verify-user">Mot de passe oublie ?</a>
        <button type="submit" className="submit-button">
          Soumettre
        </button>
      </form>
    </div>
  );

  return (
    <div className="connexion-screen">
      {isSubmitted ? (
        <div className="success-message">Connexion réussie !!</div>
      ) : (
        renderForm
      )}
    </div>
  );
}

export default ConnexionScreen;
