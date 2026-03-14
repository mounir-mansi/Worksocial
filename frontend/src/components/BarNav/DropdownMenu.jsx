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
