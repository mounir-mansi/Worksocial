import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { Button, Modal } from "react-bootstrap";
import EventCard from "../../components/Events/EventCard";
import UserBar from "../../components/UserBar/UserBar";
import { useEvent } from "../../contexts/EventContext";
import { hostname } from "../../HostnameConnect/Hostname";

export default function EventScreen() {
  const [showModal, setShowModal] = useState(false);
  const { events, getEvents, comments, getComments, likes, getLikes } =
    useEvent();

  useEffect(() => {
    getLikes();
    getEvents();
    getComments();
  }, []);

  const userID = localStorage.getItem("userId");

  events.sort((a, b) => (b.Updated_At > a.Updated_At ? 1 : -1));

  const initialValues = {
    Image: null,
    EventName: "",
    StartDate: "",
    EndDate: "",
    StartTime: "00:00:00",
    EndTime: "00:00:00",
    Description: "",
    Visibility: "Public",
    UserID: userID,
  };

  const handleCreateEvent = async (values) => {
    const {
      EventName,
      StartDate,
      EndDate,
      StartTime,
      EndTime,
      Description,
      Visibility,
      Image,
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
      formData.append("UserID", userID);

      if (Image && Image instanceof File) {
        formData.append("Image", Image);
      }
      await fetch(`${hostname}/events`, {
        method: "POST",
        body: formData,
        credentials: 'include',
      }).then((res) => {
        if (res.ok) {
          getEvents();
        } else {
          console.error("Erreur lors de la requête:", res.statusText);
        }
      });
    } catch (error) {
      console.error("Erreur lors de la requête :", error);
    }
  };

  return (
    <div className="container">
      <UserBar />
      <div className="content-area">
        {events.map((event) => {
          const eventLikes = likes.filter(
            (like) => like.Event_ID === event.Event_ID
          );
          const eventComments = comments.filter(
            (comment) => comment.Event_ID === event.Event_ID
          );
          return (
            <EventCard
              key={event.Event_ID}
              event={event}
              eventComments={eventComments}
              eventLikes={eventLikes}
            />
          );
        })}
      </div>
      <div className="sidebar">
        <div className="sidebar-item">
          <h3>Événements</h3>
          <Button onClick={() => setShowModal(true)} style={{ width: "100%" }}>
            <i className="fas fa-plus" /> Nouvel événement
          </Button>
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Créer un événement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik initialValues={initialValues} onSubmit={async (values, { resetForm }) => { await handleCreateEvent(values); resetForm(); setShowModal(false); }}>
            {({ setFieldValue }) => (
              <Form>
                <div className="title-content">
                  <label>Nom de l'événement</label>
                  <Field name="EventName" placeholder="Nom" type="text" className="form-control" />
                  <label>Date de début</label>
                  <Field name="StartDate" type="date" className="form-control" />
                  <label>Date de fin</label>
                  <Field name="EndDate" type="date" className="form-control" />
                  <label>Heure de début</label>
                  <Field name="StartTime" type="time" className="form-control" />
                  <label>Heure de fin</label>
                  <Field name="EndTime" type="time" className="form-control" />
                  <label>Description</label>
                  <Field name="Description" component="textarea" rows="4" placeholder="Description" className="form-control" />
                </div>
                <div className="visibility-group">
                  <div className="radio-group">
                    <Field name="Visibility" type="radio" value="Public" />
                    <label>Public</label>
                  </div>
                  <div className="radio-group">
                    <Field name="Visibility" type="radio" value="Private" />
                    <label>Privé</label>
                  </div>
                </div>
                <div className="img-upload">
                  <label htmlFor="Image"><i className="fa-solid fa-image" /> Joindre une image</label>
                  <input id="Image" name="Image" type="file" onChange={(e) => setFieldValue("Image", e.currentTarget.files[0])} />
                </div>
                <Button type="submit" style={{ marginTop: "1em", width: "100%" }}>Créer</Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
}
