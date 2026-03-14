// Import Modules
import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import PropTypes from "prop-types";

// Import Styles
import "./EventCard.css";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Modal from "react-bootstrap/Modal";
import { Form as MyForm } from "react-bootstrap";

// Import Utils
import ImageWithJWT from "../../utils/ImageWithJWT";
import getImageUrl from "../../utils/getImageUrl";
import { hostname } from "../../HostnameConnect/Hostname";

// Import Contexts
import { useUser } from "../../contexts/UserContext";
import { useEvent } from "../../contexts/EventContext";

export default function EventCard({ event, eventComments, eventLikes }) {
  // Contexts
  const { users, loading } = useUser();
  const { getEvents, getComments, getLikes } = useEvent();

  // States
  const [showModal, setShowModal] = useState(false);
  const [showDelModal, setShowDelModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [comment, setComment] = useState("");

  // Local Storage Variables
  const currentUserID = parseInt(localStorage.getItem("userId"), 10);

  // Mapping Creators
  const eventCreator = users.find((user) => user.User_ID === event.User_ID);

  // Formatage de la date et heure
  const formattedStartDate = new Date(event.StartDate).toLocaleDateString(
    "fr-FR",
    { day: "numeric", month: "long", year: "numeric" }
  );
  const formatTime = (t) => {
    if (!t) return null;
    const d = new Date(t);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };
  const startTime = formatTime(event.StartTime);
  const endTime = formatTime(event.EndTime);

  const commentUserPairs = eventComments.map((cmt) => {
    const commentCreator = users.find(
      (user) => parseInt(user.User_ID, 10) === parseInt(cmt.User_ID, 10)
    );
    return {
      commnt: cmt,
      user: commentCreator,
    };
  });
  // Check if user has liked
  const userHasLiked = eventLikes.some(
    (pl) => parseInt(pl.User_ID, 10) === currentUserID
  );
  useEffect(() => {
    getLikes();
    getComments();
  }, []);

  if (!eventCreator) {
    return <div>Chargement...</div>;
  }

  const imageUrl = [
    getImageUrl(event.Image),
    getImageUrl(eventCreator.ProfileImage),
  ];

  if (loading) {
    return <div>Chargement...</div>;
  }

  // Handle Modals
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleOpenDelModal = () => setShowDelModal(true);
  const handleCloseDelModal = () => setShowDelModal(false);
  const handleOpenCommentModal = () => setShowCommentModal(true);
  const handleCloseCommentModal = () => setShowCommentModal(false);

  // Handle Event Edit
  const initialValues = {
    Image: `${event.Image}`,
    EventName: `${event.EventName}`,
    StartDate: `${event.StartDate}`,
    EndDate: `${event.EndDate}`,
    StartTime: `${event.StartTime}`,
    EndTime: `${event.EndTime}`,
    Description: `${event.Description}`,
    Visibility: `${event.Visibility}`,
    UserID: event.User_ID,
  };

  const handleEditEvent = async (values) => {
    const {
      Image,
      EventName,
      StartDate,
      EndDate,
      StartTime,
      EndTime,
      Description,
      Visibility,
    } = values;
    try {
      const formData = new FormData();
      formData.append("EventName", EventName);
      formData.append("StartDate", StartDate);
      formData.append("EndDate", EndDate);
      formData.append("StartTime", StartTime);
      formData.append("EndTime", EndTime);
      formData.append("Description", Description);
      formData.append("Visibility", Visibility);
      formData.append("UserID", event.User_ID);
      if (Image && Image instanceof File) {
        formData.append("Image", Image);
      }

      const response = await fetch(`${hostname}/events/${event.Event_ID}`, {
        method: "PUT",
        body: formData,
        credentials: 'include',
      });
      if (response.ok) {
        console.info("Event Edit !!");
      } else {
        console.error("Erreur lors de la requête:", response.statusText);
      }
      handleCloseModal();
      getEvents();
    } catch (error) {
      console.error("Erreur lors de la requête:", error);
    }
  };

  // Handle Delete
  const handleDeleteEvent = async () => {
    try {
      const response = await fetch(`${hostname}/events/${event.Event_ID}`, {
        method: "DELETE",
        credentials: 'include',
      });
      if (response.ok) {
        // console.info("Post Deleted");
      } else {
        console.error("Erreur lors de la requête:", response.statusText);
      }
      handleCloseDelModal();
      getEvents();
    } catch (error) {
      console.error("Erreur lors de la requête:", error);
    }
  };
  // HandleComment
  const handleComment = (e) => setComment(e.target.value);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${hostname}/events/${event.Event_ID}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
          body: JSON.stringify({ comment }),
        }
      );
      if (response.ok) {
        console.info("Comment Added");
      } else {
        console.error("Erreur lors de la requête:", response.statusText);
      }
      setComment("");
      getComments();
    } catch (error) {
      console.error("Erreur lors de la requête:", error);
    }
  };

  // Handle Post Like / Dislike
  const handleEventLikeDislike = async (action, userId) => {
    if (action === "like") {
      try {
        const response = await fetch(
          `${hostname}/events/${event.Event_ID}/likes`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify({ userId }),
          }
        );
        if (response.ok) {
          getLikes();
        } else {
          console.error("Erreur lors de la requête:", response.statusText);
        }
      } catch (error) {
        console.error("Erreur lors de la requête:", error);
      }
    } else if (action === "unlike") {
      try {
        const response = await fetch(
          `${hostname}/events/${event.Event_ID}/likes`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify({ userId }),
          }
        );
        if (response.ok) {
          getLikes();
        } else {
          console.error("Erreur lors de la requête:", response.statusText);
        }
      } catch (error) {
        console.error("Erreur lors de la requête:", error);
      }
    }
  };

  return (
    <>
      <Card>
        <div className="card-header">
          <div className="profile">
            <div className="profileImgDiv">
              <ImageWithJWT className="pcProfileImg" imageUrl={imageUrl[1]} />
            </div>
            <span className="username">{eventCreator.Username}</span>
          </div>
          {parseInt(currentUserID, 10) ===
          parseInt(eventCreator.User_ID, 10) ? (
            <DropdownButton id="context-menu-btn" title="">
              <Dropdown.Item onClick={handleOpenModal}>Modifier</Dropdown.Item>
              <Dropdown.Item onClick={handleOpenDelModal}>Supprimer</Dropdown.Item>
            </DropdownButton>
          ) : null}
        </div>
        <Card.Body>
          <div className="card-img">
            <ImageWithJWT className="post-img" imageUrl={imageUrl[0]} />
          </div>
          <div className="card-actions">
            <button
              className={`action-btn${userHasLiked ? " action-btn--liked" : ""}`}
              type="button"
              onClick={() => handleEventLikeDislike(userHasLiked ? "unlike" : "like", currentUserID)}
            >
              <i className="fa-solid fa-thumbs-up" />
              <span>J&apos;aime</span>
              {eventLikes.length > 0 && <span className="action-btn-count">{eventLikes.length}</span>}
            </button>
            <button className="action-btn" type="button" onClick={handleOpenCommentModal}>
              <i className="fa-solid fa-comment" />
              <span>Commenter</span>
              {eventComments.length > 0 && <span className="action-btn-count">{eventComments.length}</span>}
            </button>
          </div>
          <p>
            Le {formattedStartDate}
            {startTime && ` de ${startTime}`}
            {endTime && ` à ${endTime}`}
          </p>

          <Card.Title>{event.EventName}</Card.Title>
          <Card.Text>{event.Description}</Card.Text>

          <Card.Link
            onClick={handleOpenCommentModal}
            className="view-comments-btn"
          >
            Voir tous les commentaires
          </Card.Link>
          <MyForm className="submit-comment-form">
            <MyForm.Control
              type="text"
              placeholder="Écrire un commentaire..."
              value={comment}
              onChange={handleComment}
            />
            <button
              id="submit-comment-btn"
              type="submit"
              onClick={handleSubmitComment}
            >
              <i className="fa-regular fa-paper-plane" />
            </button>
          </MyForm>
        </Card.Body>
      </Card>
      <Modal show={showModal} onHide={handleCloseModal} className="modals">
        <Modal.Header closeButton>
          <Modal.Title>Modifier l'événement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={initialValues}
            onSubmit={handleEditEvent}
            enableReinitialize
          >
            {({ setFieldValue }) => (
              <Form>
                <div className="title-content">
                  <label htmlFor="EventName">Nom de l'événement</label>
                  <Field
                    name="EventName"
                    placeholder="Nom de l'événement"
                    type="text"
                    className="form-control"
                  />
                  <div className="event-dates">
                    <div className="event-date-field">
                      <label htmlFor="StartDate">Date de début</label>
                      <Field name="StartDate" type="date" className="form-control" />
                    </div>
                    <div className="event-date-field">
                      <label htmlFor="EndDate">Date de fin</label>
                      <Field name="EndDate" type="date" className="form-control" />
                    </div>
                  </div>
                  <div className="event-dates">
                    <div className="event-date-field">
                      <label htmlFor="StartTime">Heure de début</label>
                      <Field name="StartTime" type="time" className="form-control" />
                    </div>
                    <div className="event-date-field">
                      <label htmlFor="EndTime">Heure de fin</label>
                      <Field name="EndTime" type="time" className="form-control" />
                    </div>
                  </div>
                  <label htmlFor="Description">Description</label>
                  <Field
                    name="Description"
                    component="textarea"
                    rows="4"
                    placeholder="Description"
                    className="form-control"
                  />
                </div>
                <div className="visibility-group">
                  <div className="radio-group">
                    <Field name="Visibility" type="radio" value="Public" />
                    <label htmlFor="Visibility">Public</label>
                  </div>
                  <div className="radio-group">
                    <Field name="Visibility" type="radio" value="Private" />
                    <label htmlFor="Visibility">Privé</label>
                  </div>
                </div>
                <div className="img-upload">
                  <label htmlFor="EventImage">
                    <i className="fa-solid fa-image" /> Joindre une image
                  </label>
                  <input
                    id="EventImage"
                    name="Image"
                    type="file"
                    onChange={(e) => setFieldValue("Image", e.currentTarget.files[0])}
                  />
                </div>
                <button id="editEvent-btn" type="submit">
                  Modifier
                </button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
      <Modal
        show={showDelModal}
        onHide={handleCloseDelModal}
        className="modals"
      >
        <Modal.Header closeButton>
          <Modal.Title>Supprimer l'événement</Modal.Title>
        </Modal.Header>
        <Modal.Body>Êtes-vous sûr de vouloir supprimer cet événement ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelModal}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDeleteEvent}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showCommentModal}
        onHide={handleCloseCommentModal}
        className="modals"
      >
        <Modal.Header closeButton>
          <Modal.Title>Commentaires</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {commentUserPairs.length === 0 ? (
            <p>Aucun commentaire pour l'instant</p>
          ) : (
            commentUserPairs.map(({ commnt, user }) => (
              <div className="comment" key={commnt.Comment_ID}>
                {user && (
                  <div className="profileImgDiv-comments">
                    <ImageWithJWT
                      imageUrl={getImageUrl(user.ProfileImage)}
                    />
                  </div>
                )}
                <div className="commentData">
                  <span className="username-comments">{user.Username}</span>
                  <p id="comment-content">{commnt.Comment}</p>
                </div>
              </div>
            ))
          )}

          <MyForm className="submit-comment-form">
            <MyForm.Control
              type="text"
              placeholder="Écrire un commentaire..."
              value={comment}
              onChange={handleComment}
            />
            <button
              id="submit-comment-btn"
              type="submit"
              onClick={handleSubmitComment}
            >
              <i className="fa-regular fa-paper-plane" />
            </button>
          </MyForm>
        </Modal.Body>
      </Modal>
    </>
  );
}

EventCard.propTypes = {
  event: PropTypes.shape({
    Event_ID: PropTypes.number.isRequired,
    EventName: PropTypes.string.isRequired,
    StartDate: PropTypes.string.isRequired,
    EndDate: PropTypes.string,
    StartTime: PropTypes.string,
    EndTime: PropTypes.string,
    Description: PropTypes.string,
    Visibility: PropTypes.string.isRequired,
    Image: PropTypes.string,
    User_ID: PropTypes.number.isRequired,
  }).isRequired,
  eventLikes: PropTypes.arrayOf(
    PropTypes.shape({
      Event_ID: PropTypes.number.isRequired,
      User_ID: PropTypes.number.isRequired,
    })
  ),

  eventComments: PropTypes.arrayOf(
    PropTypes.shape({
      Event_ID: PropTypes.number.isRequired,
      User_ID: PropTypes.number.isRequired,
      Comment: PropTypes.string.isRequired,
    })
  ),
};

EventCard.defaultProps = {
  eventComments: [],
  eventLikes: [],
};
