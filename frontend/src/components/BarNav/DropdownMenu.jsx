import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { LinkContainer } from "react-router-bootstrap"; // You may need to install this package
import "bootstrap/dist/css/bootstrap.min.css";
import PropTypes from "prop-types";
import "./DropdownMenu.css";

function DropdownMenu({ userName, onLogout }) {
  const userId = localStorage.getItem("userId");
  return (
    <Dropdown>
      <Dropdown.Toggle id="dropdown-basic">👋 {userName}</Dropdown.Toggle>
      <Dropdown.Menu className="custom-dropdown-menu">
        <LinkContainer to={`/profile/${userId}`}>
          <Dropdown.Item>Profil</Dropdown.Item>
        </LinkContainer>
        <Dropdown.Divider className="mobile-nav-divider" />
        <LinkContainer to="/dashboard" className="mobile-nav-item">
          <Dropdown.Item><i className="fas fa-home" /> Accueil</Dropdown.Item>
        </LinkContainer>
        <LinkContainer to="/posts" className="mobile-nav-item">
          <Dropdown.Item><i className="fas fa-edit" /> Postes</Dropdown.Item>
        </LinkContainer>
        <LinkContainer to="/surveys" className="mobile-nav-item">
          <Dropdown.Item><i className="fas fa-poll" /> Sondages</Dropdown.Item>
        </LinkContainer>
        <LinkContainer to="/events" className="mobile-nav-item">
          <Dropdown.Item><i className="fas fa-calendar-alt" /> Événements</Dropdown.Item>
        </LinkContainer>
        <LinkContainer to="/members" className="mobile-nav-item">
          <Dropdown.Item><i className="fas fa-users" /> Membres</Dropdown.Item>
        </LinkContainer>
        <LinkContainer to="/companies" className="mobile-nav-item">
          <Dropdown.Item><i className="fas fa-building" /> Entreprises</Dropdown.Item>
        </LinkContainer>
        <Dropdown.Divider />
        <Dropdown.Item onClick={onLogout}>Déconnexion</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

DropdownMenu.propTypes = {
  userName: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
};
export default DropdownMenu;
