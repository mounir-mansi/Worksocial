import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import PropTypes from "prop-types";
import "./SurveyCard.css";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Modal from "react-bootstrap/Modal";
import ProgressBar from "react-bootstrap/ProgressBar";
import { Form as MyForm } from "react-bootstrap";
import ImageWithJWT from "../../utils/ImageWithJWT";
import getImageUrl from "../../utils/getImageUrl";
import { hostname } from "../../HostnameConnect/Hostname";
import { useUser } from "../../contexts/UserContext";
import { useSurvey } from "../../contexts/SurveyContext";

export default function SurveyCard({
  survey,
  surveyVotes,
  surveyLikes,
  surveyComments,
}) {
  const { users, loading } = useUser();
  const { getSurveys, getVotes, getComments, getLikes } = useSurvey();
  const [showModal, setShowModal] = useState(false);
  const [showDelModal, setShowDelModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [comment, setComment] = useState(""); // Ecrire un commentaire
  const [votedOption, setvotedOption] = useState(""); // Envoyer le Option choisi dans vote
  const currentUserID = parseInt(localStorage.getItem("userId"), 10);

  // Mapping Creators
  const surveyCreator = users.find((user) => user.User_ID === survey.User_ID);

  const commentUserPairs = surveyComments.map((cmt) => {
    const commentCreator = users.find(
      (user) => parseInt(user.User_ID, 10) === parseInt(cmt.User_ID, 10)
    );
    return {
      commnt: cmt,
      user: commentCreator,
    };
  });

  // Check if user has liked
  const userHasLiked = surveyLikes.some(
    (sl) => parseInt(sl.User_ID, 10) === currentUserID
  );

  // Check if user has voted
  const userHasVoted = surveyVotes.some(
    (sv) => parseInt(sv.User_ID, 10) === currentUserID
  );

  useEffect(() => {
    getVotes();
    getComments();
    getLikes();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!surveyCreator) {
    return <div>Chargement...</div>;
  }

  const imageUrl = [
    getImageUrl(survey.Image),
    getImageUrl(surveyCreator.ProfileImage),
  ];

  // Handle Modals
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleOpenDelModal = () => setShowDelModal(true);
  const handleCloseDelModal = () => setShowDelModal(false);
  const handleOpenCommentModal = () => setShowCommentModal(true);
  const handleCloseCommentModal = () => setShowCommentModal(false);

  // Compter les Votes pour chaque option
  const option1Votes =
    surveyVotes.length > 0
      ? Math.ceil(
          (surveyVotes.filter((vote) => vote.Voted_For === "Option1").length /
            surveyVotes.length) *
            100
        )
      : 0;
  const option2Votes =
    surveyVotes.length > 0
      ? Math.ceil(
          (surveyVotes.filter((vote) => vote.Voted_For === "Option2").length /
            surveyVotes.length) *
            100
        )
      : 0;
  const option3Votes =
    surveyVotes.length > 0
      ? Math.ceil(
          (surveyVotes.filter((vote) => vote.Voted_For === "Option3").length /
            surveyVotes.length) *
            100
        )
      : 0;
  const option4Votes =
    surveyVotes.length > 0
      ? Math.ceil(
          (surveyVotes.filter((vote) => vote.Voted_For === "Option4").length /
            surveyVotes.length) *
            100
        )
      : 0;

  // Handle Survey Like / Dislike
  const handleSurveyLikeDislike = async (action, userId) => {
    if (action === "like") {
      try {
        const response = await fetch(
          `${hostname}/surveys/${survey.Survey_ID}/likes`,
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
          `${hostname}/surveys/${survey.Survey_ID}/likes`,
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
          // setUserHasLiked(false);
          getLikes();
        } else {
          console.error("Erreur lors de la requête:", response.statusText);
        }
      } catch (error) {
        console.error("Erreur lors de la requête:", error);
      }
    }
  };

  // Handle Survey Comment
  const handleComment = (e) => setComment(e.target.value);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${hostname}/surveys/${survey.Survey_ID}/comments`,
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

  const handleOptionChange = (e) => setvotedOption(e.target.value);

  // Handle Survey Voting
  const handleVote = async (e) => {
    e.preventDefault();

    // Check if an option is selected
    if (votedOption) {
      try {
        const response = await fetch(
          `${hostname}/surveys/${survey.Survey_ID}/votes`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify({
              votedOption,
              userId: currentUserID,
            }),
          }
        );

        if (response.ok) {
          // setUserHasVoted(true);
          getVotes();
        } else {
          console.error("Erreur lors de la requête:", response.statusText);
        }
      } catch (error) {
        console.error("Erreur lors de la requête:", error);
      }
    } else {
      console.error("Please select an option before voting.");
    }
  };

  // Handle Edit Survey
  const initialValues = {
    Title: `${survey.Title}`,
    Content: `${survey.Content}`,
    Image: `${survey.Image}`,
    Visibility: `${survey.Visibility}`,
    Option1: `${survey.Option1}`,
    Option2: `${survey.Option2}`,
    Option3: `${survey.Option3}`,
    Option4: `${survey.Option4}`,
    UserID: survey.User_ID,
  };

  const handleEditSurvey = async (values) => {
    const {
      Title,
      Content,
      Image,
      Visibility,
      Option1,
      Option2,
      Option3,
      Option4,
    } = values;
    try {
      const formData = new FormData();
      formData.append("Title", Title);
      formData.append("Content", Content);
      formData.append("Visibility", Visibility);
      formData.append("UserID", survey.User_ID);
      formData.append("Option1", Option1);
      formData.append("Option2", Option2);
      formData.append("Option3", Option3);
      formData.append("Option4", Option4);
      if (Image && Image instanceof File) {
        formData.append("Image", Image);
      }
      console.info(formData);
      const response = await fetch(`${hostname}/surveys/${survey.Survey_ID}`, {
        method: "PUT",
        body: formData,
        credentials: 'include',
      });
      if (response.ok) {
        console.info("Survey Edited");
      } else {
        console.error("Erreur lors de la requête:", response.statusText);
      }
      handleCloseModal();
      getSurveys();
    } catch (error) {
      console.error("Erreur lors de la requête:", error);
    }
  };

  // Handle Delete Survey
  const handleDeleteSurvey = async () => {
    try {
      const response = await fetch(`${hostname}/surveys/${survey.Survey_ID}`, {
        method: "DELETE",
        credentials: 'include',
      });
      if (response.ok) {
        console.info("Survey Deleted");
      } else {
        console.error("Erreur lors de la requête:", response.statusText);
      }
      handleCloseDelModal();
      getSurveys();
    } catch (error) {
      console.error("Erreur lors de la requête:", error);
    }
  };

  return (
    <div>
      <Card>
        <div className="card-header">
          <div className="profile">
            <div className="profileImgDiv">
              <ImageWithJWT className="pcProfileImg" imageUrl={imageUrl[1]} />
            </div>
            <span className="username">{surveyCreator.Username}</span>
          </div>
          {parseInt(currentUserID, 10) ===
          parseInt(surveyCreator.User_ID, 10) ? (
            <DropdownButton id="context-menu-btn" title="">
              <Dropdown.Item onClick={handleOpenModal}>Modifier</Dropdown.Item>
              <Dropdown.Item onClick={handleOpenDelModal}>Supprimer</Dropdown.Item>
            </DropdownButton>
          ) : null}
        </div>
        <Card.Body>
          <div className="card-img">
            <ImageWithJWT imageUrl={imageUrl[0]} />
          </div>
          {!userHasLiked ? (
            <button
              className="action-btn"
              name="like"
              type="button"
              onClick={() => handleSurveyLikeDislike("like", currentUserID)}
            >
              <i className="fa-regular fa-heart" />
              <span className="action-btn-text">{surveyLikes.length}</span>
            </button>
          ) : (
            <button
              className="action-btn"
              name="unlike"
              type="button"
              onClick={() => handleSurveyLikeDislike("unlike", currentUserID)}
            >
              <i className="fa-solid fa-heart" />
              <span className="action-btn-text">{surveyLikes.length}</span>
            </button>
          )}
          <button
            className="action-btn"
            type="button"
            onClick={handleOpenCommentModal}
          >
            <i className="fa-regular fa-comment" />
          </button>
          <h5 className="card-title">{survey.Title}</h5>
          <p className="card-text">{survey.Content}</p>
          <div className="survey-options">
            {userHasVoted ? (
              <div className="voting-results">
                <div className="vote-result">
                  <ProgressBar now={option1Votes > 0 ? option1Votes : 0} />
                  <span>{survey.Option1}</span>
                </div>
                <div className="vote-result">
                  <ProgressBar now={option2Votes > 0 ? option2Votes : 0} />
                  <span>{survey.Option2}</span>
                </div>
                {survey.Option3 ? (
                  <div className="vote-result">
                    <ProgressBar now={option3Votes > 0 ? option3Votes : 0} />
                    <span>{survey.Option3}</span>
                  </div>
                ) : null}
                {survey.Option4 ? (
                  <div className="vote-result">
                    <ProgressBar now={option4Votes > 0 ? option4Votes : 0} />
                    <span>{survey.Option4}</span>
                  </div>
                ) : null}
              </div>
            ) : (
              <MyForm>
                <div className="options-group">
                  <div className="surveyOption">
                    <input
                      name="surveyOption"
                      type="radio"
                      className="form-check-input"
                      value="Option1"
                      checked={votedOption === "Option1"}
                      onChange={handleOptionChange}
                    />
                    <label htmlFor="Option1">{survey.Option1}</label>
                  </div>
                  <div className="surveyOption">
                    <input
                      name="surveyOption"
                      type="radio"
                      className="form-check-input"
                      value="Option2"
                      checked={votedOption === "Option2"}
                      onChange={handleOptionChange}
                    />
                    <label htmlFor="Option2">{survey.Option2}</label>
                  </div>
                  {survey.Option3 ? (
                    <div className="surveyOption">
                      <input
                        name="surveyOption"
                        type="radio"
                        className="form-check-input"
                        value="Option3"
                        checked={votedOption === "Option3"}
                        onChange={handleOptionChange}
                      />
                      <label htmlFor="Option3">{survey.Option3}</label>
                    </div>
                  ) : null}
                  {survey.Option4 ? (
                    <div className="surveyOption">
                      <input
                        name="surveyOption"
                        type="radio"
                        className="form-check-input"
                        value="Option4"
                        checked={votedOption === "Option4"}
                        onChange={handleOptionChange}
                      />
                      <label htmlFor="Option4">{survey.Option4}</label>
                    </div>
                  ) : null}
                </div>
                <div className="submit-survey">
                  <button name="submit" type="submit" onClick={handleVote}>
                    Voter
                  </button>
                </div>
              </MyForm>
            )}
          </div>
        </Card.Body>
      </Card>
      <Modal show={showModal} onHide={handleCloseModal} className="modals">
        <Modal.Header closeButton>
          <Modal.Title>Modifier le sondage</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={initialValues}
            onSubmit={handleEditSurvey}
            enableReinitialize
          >
            {({ setFieldValue }) => (
              <Form>
                <div className="title-content">
                  <Field
                    name="Title"
                    placeholder="Titre"
                    type="text"
                    className="form-control"
                  />
                  <Field
                    name="Content"
                    component="textarea"
                    rows="3"
                    placeholder="Contenu du sondage"
                    className="form-control"
                  />
                </div>
                <div className="visibility-group">
                  <div className="radio-group">
                    <Field
                      name="Visibility"
                      type="radio"
                      value="Public"
                      className="form-check-input"
                    />
                    <label htmlFor="Visibility">Public</label>
                  </div>
                  <div className="radio-group">
                    <Field
                      name="Visibility"
                      type="radio"
                      value="Private"
                      className="form-check-input"
                    />
                    <label htmlFor="Visibility">Privé</label>
                  </div>
                </div>
                <div className="options-group">
                  <label htmlFor="Option1">Option 1</label>
                  <Field name="Option1" type="text" className="form-control" />
                  <label htmlFor="Option2">Option 2</label>
                  <Field name="Option2" type="text" className="form-control" />
                  <label htmlFor="Option3">Option 3</label>
                  <Field name="Option3" type="text" className="form-control" />
                  <label htmlFor="Options4">Option 4</label>
                  <Field name="Option4" type="text" className="form-control" />
                </div>
                <div className="img-upload">
                  <label htmlFor="Image">
                    <i className="fa-solid fa-image" /> Joindre une image
                  </label>
                  <input
                    id="Image"
                    name="Image"
                    type="file"
                    onChange={(event) =>
                      setFieldValue("Image", event.currentTarget.files[0])
                    }
                  />
                </div>
                <button id="editSurvey-btn" type="submit">
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
          <Modal.Title>Supprimer le sondage</Modal.Title>
        </Modal.Header>
        <Modal.Body>Êtes-vous sûr de vouloir supprimer ce sondage ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelModal}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDeleteSurvey}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showDelModal}
        onHide={handleCloseDelModal}
        className="modals"
      >
        <Modal.Header closeButton>
          <Modal.Title>Supprimer le sondage</Modal.Title>
        </Modal.Header>
        <Modal.Body>Êtes-vous sûr de vouloir supprimer ce sondage ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelModal}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDeleteSurvey}>
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
    </div>
  );
}

SurveyCard.propTypes = {
  survey: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    Content: PropTypes.string.isRequired,
    Image: PropTypes.string,
    Survey_ID: PropTypes.number.isRequired,
    Visibility: PropTypes.string.isRequired,
    User_ID: PropTypes.number.isRequired,
    Option1: PropTypes.string.isRequired,
    Option2: PropTypes.string.isRequired,
    Option3: PropTypes.string,
    Option4: PropTypes.string,
  }).isRequired,
  surveyVotes: PropTypes.arrayOf(
    PropTypes.shape({
      Survey_ID: PropTypes.number.isRequired,
      User_ID: PropTypes.number.isRequired,
      Voted_For: PropTypes.string.isRequired,
    })
  ),
  surveyLikes: PropTypes.arrayOf(
    PropTypes.shape({
      Survey_ID: PropTypes.number.isRequired,
      User_ID: PropTypes.number.isRequired,
    })
  ),
  surveyComments: PropTypes.arrayOf(
    PropTypes.shape({
      Survey_ID: PropTypes.number.isRequired,
      User_ID: PropTypes.number.isRequired,
      Comment: PropTypes.string.isRequired,
    })
  ),
};

SurveyCard.defaultProps = {
  surveyVotes: [],
  surveyLikes: [],
  surveyComments: [],
};
