// Import Modules
import React from "react";
import PropTypes from "prop-types";

// Import Styles
import "./EventMiniCard.css";
import Card from "react-bootstrap/Card";
// import Button from "react-bootstrap/Button";

import { useUser } from "../../contexts/UserContext";

// Import Utils
import ImageWithJWT from "../../utils/ImageWithJWT";
import getImageUrl from "../../utils/getImageUrl";

export default function EventMiniCard({ event, daysRemaining }) {
  // Contexts
  const { users } = useUser();

  // Mapping Creators
  const eventCreator = users.find((user) => user.User_ID === event.User_ID);

  // Formatage de la date
  const formattedStartDate = new Date(event.StartDate).toLocaleDateString(
    "fr-FR",
    { day: "numeric", month: "long", year: "numeric" }
  );

  const imageUrl = getImageUrl(event.Image);

  return (
    <Card>
      <Card.Header>
        <span>
          <strong>{formattedStartDate}</strong>
          <span className="subtext"> dans {daysRemaining} jours</span>
        </span>
        <span>
          <span className="subtext">par</span>{" "}
          {eventCreator ? (
            <strong>{eventCreator.FirstName}</strong>
          ) : (
            <strong>Inconnu</strong>
          )}
        </span>
      </Card.Header>
      <Card.Body className="minicard-body">
        <div className="minicard-img">
          <ImageWithJWT className="post-img" imageUrl={imageUrl} />
        </div>
        <div>
          <Card.Title>{event.EventName}</Card.Title>
          <Card.Text>{event.Description}</Card.Text>
        </div>
      </Card.Body>
    </Card>
  );
}

EventMiniCard.propTypes = {
  event: PropTypes.shape({
    Event_ID: PropTypes.number.isRequired,
    EventName: PropTypes.string.isRequired,
    StartDate: PropTypes.string.isRequired,
    EndDate: PropTypes.string,
    StartTime: PropTypes.string,
    EndTime: PropTypes.string,
    Description: PropTypes.string,
    Image: PropTypes.string,
    User_ID: PropTypes.number.isRequired,
  }).isRequired,
  daysRemaining: PropTypes.number.isRequired,
};
