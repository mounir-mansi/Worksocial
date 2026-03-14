import React from "react";
import { Link } from "react-router-dom";
import "./UserBar.css";

export default function UserBar() {
  return (
    <nav className="UserBar">
      <ul className="NavLinks">
        <li>
          <Link to="/dashboard">
            <i className="fas fa-home" /> Accueil
          </Link>
        </li>
        <li>
          <Link to="/posts">
            <i className="fas fa-edit" /> Postes
          </Link>
        </li>
        <li>
          <Link to="/surveys">
            <i className="fas fa-poll" /> Sondages
          </Link>
        </li>
        <li>
          <Link to="/events">
            <i className="fas fa-calendar-alt" /> Événements
          </Link>
        </li>
        <li>
          <Link to="/members">
            <i className="fas fa-users" /> Membres
          </Link>
        </li>
        <li>
          <Link to="/companies">
            <i className="fas fa-building" /> Entreprises
          </Link>
        </li>
      </ul>
    </nav>
  );
}
