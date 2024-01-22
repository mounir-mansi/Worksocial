import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/logo.png";
import { useAuth } from "../../utils/useConnecte";
import "./BarNav.css";

function BarNav() {
  const [showModal, setShowModal] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const firstName = isLoggedIn ? localStorage.getItem("firstName") : "Visiteur";
  // Déclaration de handleCloseModal avant son utilisation
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("userToken");
      await fetch("http://localhost:5000/logout", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      logout();
      navigate("/HomeScreen");
    } catch (error) {
      console.error("Erreur lors de la déconnexion : ", error);
    } finally {
      handleCloseModal();
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const renderModal = showModal && (
    <div className="modal">
      <div className="modal-content">
        <p>Voulez-vous vraiment vous déconnecter ?</p>
        <button type="button" onClick={handleLogout}>
          Oui
        </button>
        <button type="button" onClick={handleCloseModal}>
          Non
        </button>
      </div>
    </div>
  );

  return (
    <nav className="BarNav">
      <div className="Logo">
        <img src={Logo} alt="logo" className="navbar_logo" />
      </div>
      <ul className="NavLinks">
        <li className="welcome-message">Bonjour {firstName}</li>
        <li>
          <Link to="/HomeScreen">Accueil</Link>
        </li>
        {!isLoggedIn && (
          <>
            <li>
              <Link to="/ConnexionScreen">Connexion</Link>
            </li>
            <li>
              <Link to="/InscriptionScreen">Inscription</Link>
            </li>
          </>
        )}
        {isLoggedIn && (
          <>
            <li>
              <Link to="/MembersScreen">Membres</Link>
            </li>
            <li>
              <Link to="/SendageScreen">Sendage</Link>
            </li>
            <li>
              <button type="button" onClick={handleOpenModal}>
                Deconnexion
              </button>
            </li>
          </>
        )}
      </ul>
      {renderModal}
    </nav>
  );
}

export default BarNav;
