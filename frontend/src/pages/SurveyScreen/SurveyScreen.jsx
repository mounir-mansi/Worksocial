import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import UserBar from "../../components/UserBar/UserBar";
import SurveyCard from "../../components/Surveys/SurveyCard";
import "./SurveyScreen.css";
import { useSurvey } from "../../contexts/SurveyContext";
import { hostname } from "../../HostnameConnect/Hostname";

export default function SurveyScreen() {
  const [showModal, setShowModal] = useState(false);
  const {
    surveys,
    getSurveys,
    votes,
    getVotes,
    likes,
    getLikes,
    comments,
    getComments,
  } = useSurvey();

  useEffect(() => {
    getSurveys();
    getVotes();
    getComments();
    getLikes();
  }, []);

  const userID = localStorage.getItem("userId");

  surveys.sort((a, b) => (b.Updated_At > a.Updated_At ? 1 : -1));

  const initialValues = {
    Title: "",
    Content: "",
    Image: null,
    Visibility: "Public",
    Option1: "",
    Option2: "",
    Option3: "",
    Option4: "",
    UserID: userID,
  };

  const handleCreateSurvey = async (values) => {
    const {
      Image,
      Title,
      Content,
      Visibility,
      Option1,
      Option2,
      Option3,
      Option4,
    } = values;
    console.info(values);
    try {
      const formData = new FormData();
      formData.append("Title", Title);
      formData.append("Content", Content);
      formData.append("Visibility", Visibility);
      formData.append("Option1", Option1);
      formData.append("Option2", Option2);
      formData.append("Option3", Option3);
      formData.append("Option4", Option4);
      formData.append("UserID", userID);
      if (Image && Image instanceof File) {
        formData.append("Image", Image);
      }
      const response = await fetch(`${hostname}/surveys`, {
        method: "POST",
        body: formData,
        credentials: 'include',
      });
      if (response.ok) {
        console.info("Survey Created");
        getSurveys();
      } else {
        console.error("Erreur lors de la requête:", response.statusText);
      }
    } catch (error) {
      console.error("Erreur lors de la requête:", error);
    }
  };

  return (
    <div className="container">
      <UserBar />
      <div className="content-area">
        {surveys.map((survey) => {
          const surveyVotes = votes.filter(
            (vote) => vote.Survey_ID === survey.Survey_ID
          );
          const surveyLikes = likes.filter(
            (like) => like.Survey_ID === survey.Survey_ID
          );
          const surveyComments = comments.filter(
            (comment) => comment.Survey_ID === survey.Survey_ID
          );
          return (
            <SurveyCard
              key={survey.Survey_ID}
              survey={survey}
              surveyVotes={surveyVotes}
              surveyLikes={surveyLikes}
              surveyComments={surveyComments}
            />
          );
        })}
      </div>
      <div className="sidebar">
        <div className="sidebar-item">
          <h3>Sondages</h3>
          <Button onClick={() => setShowModal(true)} style={{ width: "100%" }}>
            <i className="fas fa-plus" /> Nouveau sondage
          </Button>
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Créer un sondage</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik initialValues={initialValues} onSubmit={async (values, { resetForm }) => { await handleCreateSurvey(values); resetForm(); setShowModal(false); }}>
            {({ setFieldValue }) => (
              <Form>
                <div className="title-content">
                  <Field name="Title" placeholder="Titre" type="text" className="form-control" />
                  <Field name="Content" component="textarea" rows="3" placeholder="Description" className="form-control" />
                </div>
                <div className="visibility-group">
                  <Field name="Visibility" type="radio" value="Public" className="form-check-input" />
                  <label htmlFor="Visibility">Public</label>
                  <Field name="Visibility" type="radio" value="Private" className="form-check-input" />
                  <label htmlFor="Visibility">Privé</label>
                </div>
                <div className="options-group">
                  <label>Option 1</label>
                  <Field name="Option1" type="text" className="form-control" />
                  <label>Option 2</label>
                  <Field name="Option2" type="text" className="form-control" />
                  <label>Option 3</label>
                  <Field name="Option3" type="text" className="form-control" />
                  <label>Option 4</label>
                  <Field name="Option4" type="text" className="form-control" />
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
