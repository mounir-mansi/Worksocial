import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import PostCard from "../../components/Posts/PostCard";
import "./PostScreen.css";
import UserBar from "../../components/UserBar/UserBar";
import { usePost } from "../../contexts/PostContext";
import { hostname } from "../../HostnameConnect/Hostname";

export default function PostScreen() {
  const [showModal, setShowModal] = useState(false);

  const { posts, getPosts, comments, getComments, likes, getLikes } = usePost();

  useEffect(() => {
    getPosts();
    getComments();
    getLikes();
  }, []);

  const token = localStorage.getItem("userToken");
  const userID = localStorage.getItem("userId");

  posts.sort((a, b) => (b.Updated_At > a.Updated_At ? 1 : -1));

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const initialValues = {
    Title: "",
    Content: "",
    Image: null,
    Visibility: "Public",
    UserID: userID,
  };

  const handleCreatePost = async (values) => {
    const { Title, Content, Image, Visibility } = values;
    try {
      const formData = new FormData();
      formData.append("Title", Title);
      formData.append("Content", Content);
      formData.append("Visibility", Visibility);
      formData.append("UserID", userID);
      if (Image && Image instanceof File) {
        formData.append("Image", Image);
      }
      await fetch(`${hostname}/posts`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        if (res.ok) {
          getPosts();
        } else {
          console.error("Erreur lors de la requête:", res.statusText);
        }
      });
      handleCloseModal();
    } catch (error) {
      console.error("Erreur lors de la requête:", error);
    }
  };

  return (
    <>
      <UserBar />
      <div className="container">
        <div className="button">
          <Button type="button" onClick={handleOpenModal}>
            Create Post
          </Button>
        </div>
        <div className="post-list">
          {posts.map((post) => {
            const postLikes = likes.filter(
              (like) => like.Post_ID === post.Post_ID
            );
            const postComments = comments.filter(
              (comment) => comment.Post_ID === post.Post_ID
            );
            return (
              <PostCard
                key={post.Post_ID}
                post={post}
                postLikes={postLikes}
                postComments={postComments}
              />
            );
          })}
        </div>
        <Modal show={showModal} onHide={handleCloseModal} className="modals">
          <Modal.Header closeButton>Create Post</Modal.Header>
          <Modal.Body>
            <Formik initialValues={initialValues} onSubmit={handleCreatePost}>
              {({ setFieldValue }) => (
                <Form>
                  <div className="title-content">
                    <Field
                      name="Title"
                      placeholder="Title"
                      type="text"
                      className="form-control"
                    />
                    <Field
                      name="Content"
                      component="textarea"
                      rows="3"
                      placeholder="Write Post"
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
                      <label htmlFor="Visibility">Private</label>
                    </div>
                  </div>
                  <div className="img-upload">
                    <label htmlFor="Image">
                      <i className="fa-solid fa-image" /> Attach Image
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
                  <button id="createPost-btn" type="submit">
                    Create
                  </button>
                </Form>
              )}
            </Formik>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}
