// Import Modules
import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import PropTypes from "prop-types";

// Import Styles
// import "./PostCard.css";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Modal from "react-bootstrap/Modal";
import { Form as MyForm } from "react-bootstrap";

// Import Utitlities
import ImageWithJWT from "../../utils/ImageWithJWT";
import getImageUrl from "../../utils/getImageUrl";
import { hostname } from "../../HostnameConnect/Hostname";

// Import Contexts
import { useUser } from "../../contexts/UserContext";
import { usePost } from "../../contexts/PostContext";

export default function PostCard({ post, postLikes, postComments }) {
  // Contexts
  const { users, loading } = useUser();
  const { getPosts, getLikes, getComments } = usePost();

  // States
  const [showModal, setShowModal] = useState(false);
  const [showDelModal, setShowDelModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [comment, setComment] = useState("");

  // Local Storage Variables
  const currentUserID = parseInt(localStorage.getItem("userId"), 10);

  // Mapping Creators
  const postCreator = users.find((user) => user.User_ID === post.User_ID);

  const commentUserPairs = postComments.map((cmt) => {
    const commentCreator = users.find(
      (user) => parseInt(user.User_ID, 10) === parseInt(cmt.User_ID, 10)
    );
    return {
      commnt: cmt,
      user: commentCreator,
    };
  });

  // Check if user has liked
  const userHasLiked = postLikes.some(
    (pl) => parseInt(pl.User_ID, 10) === currentUserID
  );

  useEffect(() => {
    getLikes();
    getComments();
  }, []);

  if (!postCreator) {
    return <div>Chargement...</div>;
  }

  const imageUrl = [
    getImageUrl(post.Image),
    getImageUrl(postCreator.ProfileImage),
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

  // Handle Post Edit
  const initialValues = {
    Title: `${post.Title}`,
    Content: `${post.Content}`,
    Image: `${post.Image}`,
    Visibility: `${post.Visibility}`,
    UserID: post.User_ID,
  };

  const handleEditPost = async (values) => {
    const { Title, Content, Image, Visibility } = values;
    try {
      const formData = new FormData();
      formData.append("Title", Title);
      formData.append("Content", Content);
      formData.append("Visibility", Visibility);
      formData.append("UserID", post.User_ID);
      if (Image && Image instanceof File) {
        formData.append("Image", Image);
      }

      const response = await fetch(`${hostname}/posts/${post.Post_ID}`, {
        method: "PUT",
        body: formData,
        credentials: 'include',
      });
      if (response.ok) {
        // console.info("Post Edited");
      } else {
        console.error("Erreur lors de la requête:", response.statusText);
      }
      handleCloseModal();
      getPosts();
    } catch (error) {
      console.error("Erreur lors de la requête:", error);
    }
  };

  // Handle Post Delete
  const handleDeletePost = async () => {
    try {
      const response = await fetch(`${hostname}/posts/${post.Post_ID}`, {
        method: "DELETE",
        credentials: 'include',
      });
      if (response.ok) {
        // console.info("Post Deleted");
      } else {
        console.error("Erreur lors de la requête:", response.statusText);
      }
      handleCloseDelModal();
      getPosts();
    } catch (error) {
      console.error("Erreur lors de la requête:", error);
    }
  };

  // Handle Post Like / Dislike
  const handlePostLikeDislike = async (action, userId) => {
    if (action === "like") {
      try {
        const response = await fetch(
          `${hostname}/posts/${post.Post_ID}/likes`,
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
          `${hostname}/posts/${post.Post_ID}/likes`,
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

  // Handle Post Comment
  const handleComment = (e) => setComment(e.target.value);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${hostname}/posts/${post.Post_ID}/comments`,
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

  // Handle HTML
  return (
    <>
      <Card>
        <div className="card-header">
          <div className="profile">
            <div className="profileImgDiv">
              <ImageWithJWT className="pcProfileImg" imageUrl={imageUrl[1]} />
            </div>
            <span className="username">{postCreator.Username}</span>
          </div>
          {parseInt(currentUserID, 10) === parseInt(postCreator.User_ID, 10) ? (
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
          {!userHasLiked ? (
            <button
              className="action-btn"
              name="like"
              type="button"
              onClick={() => handlePostLikeDislike("like", currentUserID)}
            >
              <i className="fa-regular fa-heart" />
              {postLikes.length > 0 && <span className="action-btn-text">{postLikes.length}</span>}
            </button>
          ) : (
            <button
              className="action-btn"
              name="unlike"
              type="button"
              onClick={() => handlePostLikeDislike("unlike", currentUserID)}
            >
              <i className="fa-solid fa-heart" />
              {postLikes.length > 0 && <span className="action-btn-text">{postLikes.length}</span>}
            </button>
          )}
          <button
            className="action-btn"
            type="button"
            onClick={handleOpenCommentModal}
          >
            <i className="fa-regular fa-comment" />
          </button>
          <Card.Title>{post.Title}</Card.Title>
          <Card.Text>{post.Content}</Card.Text>
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
          <Modal.Title>Modifier le poste</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={initialValues}
            onSubmit={handleEditPost}
            enableReinitialize
          >
            {({ setFieldValue }) => (
              <Form>
                <div className="title-content">
                  <label htmlFor="Title">Titre</label>
                  <Field
                    name="Title"
                    placeholder="Titre"
                    type="text"
                    className="form-control"
                  />
                  <label htmlFor="Content">Contenu</label>
                  <Field
                    name="Content"
                    component="textarea"
                    rows="3"
                    placeholder="Contenu du poste"
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
                <button id="editPost-btn" type="submit">
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
          <Modal.Title>Supprimer le poste</Modal.Title>
        </Modal.Header>
        <Modal.Body>Êtes-vous sûr de vouloir supprimer ce poste ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelModal}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDeletePost}>
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

// PropTypes
PostCard.propTypes = {
  post: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    Content: PropTypes.string.isRequired,
    Image: PropTypes.string,
    Post_ID: PropTypes.number.isRequired,
    Visibility: PropTypes.string.isRequired,
    User_ID: PropTypes.number.isRequired,
  }).isRequired,
  postLikes: PropTypes.arrayOf(
    PropTypes.shape({
      Post_ID: PropTypes.number.isRequired,
      User_ID: PropTypes.number.isRequired,
    })
  ),
  postComments: PropTypes.arrayOf(
    PropTypes.shape({
      Post_ID: PropTypes.number.isRequired,
      User_ID: PropTypes.number.isRequired,
      Comment: PropTypes.string.isRequired,
    })
  ),
};

PostCard.defaultProps = {
  postLikes: [],
  postComments: [],
};
