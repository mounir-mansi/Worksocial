import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
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

  const userID = localStorage.getItem("userId");

  posts.sort((a, b) => (b.Updated_At > a.Updated_At ? 1 : -1));

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
        credentials: 'include',
      }).then((res) => {
        if (res.ok) {
          getPosts();
        } else {
          console.error("Erreur lors de la requête:", res.statusText);
        }
      });
    } catch (error) {
      console.error("Erreur lors de la requête:", error);
    }
  };

  return (
    <div className="container">
      <UserBar />
      <div className="content-area">
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
      <div className="sidebar">
        <div className="sidebar-item">
          <h3>Posts</h3>
          <Button onClick={() => setShowModal(true)} style={{ width: "100%" }}>
            <i className="fas fa-plus" /> Nouveau post
          </Button>
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Créer un post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik initialValues={initialValues} onSubmit={async (values, { resetForm }) => { await handleCreatePost(values); resetForm(); setShowModal(false); }}>
            {({ setFieldValue }) => (
              <Form>
                <div className="title-content">
                  <Field name="Title" placeholder="Titre" type="text" className="form-control" />
                  <Field name="Content" component="textarea" rows="4" placeholder="Contenu du post" className="form-control" />
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
                  <label htmlFor="Image"><i className="fa-solid fa-image" /> Joindre une image</label>
                  <input id="Image" name="Image" type="file" onChange={(e) => setFieldValue("Image", e.currentTarget.files[0])} />
                </div>
                <Button type="submit" style={{ marginTop: "1em", width: "100%" }}>Publier</Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
}
