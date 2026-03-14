import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/logo.png";
import { useAuth } from "../../utils/useConnecte";
import "./BarNav.css";
import ImageWithJWT from "../../utils/ImageWithJWT";
import getImageUrl from "../../utils/getImageUrl";
import { hostname } from "../../HostnameConnect/Hostname";
import DropdownMenu from "./DropdownMenu";

export default function BarNav() {
  const { isLoggedIn, logout } = useAuth();
  const user = isLoggedIn ? JSON.parse(localStorage.getItem("user")) : null;
  const navigate = useNavigate();
  const firstName = user ? user.FirstName : "Visiteur";
  const imageUrl = user ? getImageUrl(user.ProfileImage) : "";

  const handleLogout = async () => {
    try {
      await fetch(`${hostname}/logout`, {
        method: "GET",
        credentials: 'include',
      });
      logout();
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion : ", error);
    }
  };

  const newDay = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const today = newDay.toLocaleDateString("fr-FR", options);

  return (
    <div>
      {isLoggedIn ? (
        <nav className="BarNav-loggedIn">
          <div className="logo">
            <img src={Logo} alt="logo" className="navbar_logo" />
          </div>
          <ul className="NavLinks-BarNav">
            <span className="today">{today}</span>
            <li className="profileItem">
              <div className="profile-image">
                <ImageWithJWT imageUrl={imageUrl} alt="Profile" />
              </div>
              <div className="salutation">
                <DropdownMenu userName={firstName} onLogout={handleLogout} />
              </div>
            </li>
          </ul>
        </nav>
      ) : (
        <nav className="BarNav-loggedOut">
          <div className="logo">
            <img src={Logo} alt="logo" className="navbar_logo" />
          </div>
          <ul className="NavLinks-BarNav landing-links">
            <li>
              <Link to="/connexion">
                <i className="fas fa-sign-in-alt" /> Connexion
              </Link>
            </li>
            <li>
              <Link to="/inscription" id="inscription-button">
                <i className="fas fa-user-plus" /> Inscription
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
