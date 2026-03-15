import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import UserBar from "../../components/UserBar/UserBar";
import PostCard from "../../components/Posts/PostCard";
import EventCard from "../../components/Events/EventCard";
import SurveyCard from "../../components/Surveys/SurveyCard";
import "./MyUserProfilScreen.css";
import ImageWithJWT from "../../utils/ImageWithJWT";
import getImageUrl from "../../utils/getImageUrl";
import { hostname } from "../../HostnameConnect/Hostname";
import { usePost } from "../../contexts/PostContext";
import { useEvent } from "../../contexts/EventContext";
import { useSurvey } from "../../contexts/SurveyContext";

function MyUserProfilScreen() {
  const [user, setUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const { userId } = useParams();
  const userIdLoggedIn = localStorage.getItem("userId");
  const profileId = userId || userIdLoggedIn;

  // Contextes pour les tabs
  const { posts, getPosts, getLikes: getPostLikes, getComments: getPostComments, likes: postLikes, comments: postComments } = usePost();
  const { events, getEvents, getComments: getEventComments, getLikes: getEventLikes, comments: eventComments, likes: eventLikes } = useEvent();
  const { surveys, getSurveys, getVotes, getComments: getSurveyComments, getLikes: getSurveyLikes, votes, comments: surveyComments, likes: surveyLikes } = useSurvey();

  const fetchUser = async () => {
    try {
      const response = await fetch(`${hostname}/users/${profileId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
      });
      if (!response.ok) return;
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Erreur lors de la récupération du profil:", error);
    }
  };

  useEffect(() => {
    fetchUser();
    getPosts();
    getEvents();
    getSurveys();
  }, [profileId]);

  useEffect(() => {
    if (posts.length > 0) { getPostLikes(); getPostComments(); }
  }, [posts.length]);

  useEffect(() => {
    if (events.length > 0) { getEventLikes(); getEventComments(); }
  }, [events.length]);

  useEffect(() => {
    if (surveys.length > 0) { getSurveyLikes(); getSurveyComments(); getVotes(); }
  }, [surveys.length]);

  const calculateAge = (birthDate) => {
    const birthday = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const m = today.getMonth() - birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) age--;
    return age;
  };

  const handleSubmit = async (values) => {
    const { username, lastName, firstName, birthDate, address, email, password, gender, biography, phone } = values;

    if (password && password !== values.passwordConfirmation) {
      console.error("Les mots de passe ne correspondent pas");
      return;
    }

    const formData = new FormData();
    formData.append("Username", username);
    formData.append("LastName", lastName);
    formData.append("FirstName", firstName);
    if (birthDate) {
      formData.append("BirthDate", birthDate);
      formData.append("Age", calculateAge(birthDate).toString());
    }
    if (address) formData.append("Address", address);
    formData.append("Email", email);
    if (password) formData.append("Password", password);
    formData.append("Role", "User");
    if (gender) formData.append("Gender", gender);
    if (phone) formData.append("Phone", phone);
    if (biography) formData.append("Biography", biography);
    if (values.ProfileImage && values.ProfileImage instanceof File) {
      formData.append("ProfileImage", values.ProfileImage);
    }

    try {
      const response = await fetch(`${hostname}/users/${userIdLoggedIn}`, {
        method: "PUT",
        credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        setShowEditModal(false);
        fetchUser();
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          if (response.status === 409) {
            if (data.error.includes("nom d'utilisateur")) setUsernameError("Ce pseudo est déjà utilisé.");
            if (data.error.includes("email")) setEmailError("Cet email est déjà utilisé.");
          }
        }
      }
    } catch (error) {
      console.error("Erreur lors de la requête:", error);
    }
  };

  if (!user) return <div>Chargement...</div>;

  const isOwnProfile = String(userIdLoggedIn) === String(profileId);
  const imageUrl = getImageUrl(user.ProfileImage);

  const genderLabel = user.Gender === "Male" ? "Homme" : user.Gender === "Female" ? "Femme" : user.Gender === "Other" ? "Autre" : null;
  const birthYear = user.BirthDate ? new Date(user.BirthDate).getFullYear() : null;

  // Filtrer les contenus par utilisateur
  const userPosts = posts.filter((p) => String(p.User_ID) === String(profileId));
  const userEvents = events.filter((e) => String(e.User_ID) === String(profileId));
  const userSurveys = surveys.filter((s) => String(s.User_ID) === String(profileId));

  const initialValues = {
    username: user.Username || "",
    lastName: user.LastName || "",
    firstName: user.FirstName || "",
    birthDate: user.BirthDate ? user.BirthDate.split("T")[0] : "",
    address: user.Address || "",
    email: user.Email || "",
    password: "",
    passwordConfirmation: "",
    gender: user.Gender || "",
    phone: user.Phone || "",
    biography: user.Biography || "",
    ProfileImage: null,
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Pseudo requis"),
    lastName: Yup.string().required("Nom requis"),
    firstName: Yup.string().required("Prénom requis"),
    email: Yup.string().email("Email invalide").required("Email requis"),
    birthDate: Yup.date().nullable(),
    address: Yup.string().nullable(),
    gender: Yup.string().nullable(),
    phone: Yup.string().nullable(),
    biography: Yup.string().nullable(),
  });

  return (
    <div className="container">
      <UserBar />
      <div className="innerContainer">
        {/* Panel gauche — infos utilisateur */}
        <div className="profilePage-leftSection">
          <div className="profilePage-image">
            <ImageWithJWT imageUrl={imageUrl} alt={user.FirstName} />
          </div>
          <div className="profilePage-userInfo">
            <h4>{user.FirstName} {user.LastName}</h4>
            <p className="profile-username">@{user.Username}</p>
            {user.Biography && <p className="profile-bio">{user.Biography}</p>}

            <hr className="profile-divider" />

            <ul className="profile-details">
              {user.Email && (
                <li><i className="fas fa-envelope" /> {user.Email}</li>
              )}
              {user.Phone && (
                <li><i className="fas fa-phone" /> {user.Phone}</li>
              )}
              {user.Address && (
                <li><i className="fas fa-map-marker-alt" /> {user.Address}</li>
              )}
              {genderLabel && (
                <li><i className="fas fa-user" /> {genderLabel}</li>
              )}
              {birthYear && (
                <li><i className="fas fa-birthday-cake" /> Né(e) en {birthYear} · {user.Age} ans</li>
              )}
            </ul>

            <div className="profile-stats">
              <div className="stat-item">
                <strong>{userPosts.length}</strong>
                <span>Postes</span>
              </div>
              <div className="stat-item">
                <strong>{userEvents.length}</strong>
                <span>Événements</span>
              </div>
              <div className="stat-item">
                <strong>{userSurveys.length}</strong>
                <span>Sondages</span>
              </div>
            </div>

            {isOwnProfile && (
              <Button type="button" className="w-100 mt-2" onClick={() => setShowEditModal(true)}>
                Modifier le profil
              </Button>
            )}
          </div>
        </div>

        {/* Panel droit — tabs avec contenu */}
        <div className="profilePage-rightSection">
          <Tabs defaultActiveKey="posts" className="mb-3" fill>
            <Tab eventKey="posts" title={`Posts (${userPosts.length})`}>
              {userPosts.length === 0 ? (
                <p className="empty-tab">Aucun poste pour l'instant.</p>
              ) : (
                userPosts.map((post) => {
                  const likes = postLikes.filter((l) => l.Post_ID === post.Post_ID);
                  const comments = postComments.filter((c) => c.Post_ID === post.Post_ID);
                  return (
                    <PostCard key={post.Post_ID} post={post} postLikes={likes} postComments={comments} />
                  );
                })
              )}
            </Tab>
            <Tab eventKey="events" title={`Événements (${userEvents.length})`}>
              {userEvents.length === 0 ? (
                <p className="empty-tab">Aucun événement créé.</p>
              ) : (
                userEvents.map((event) => {
                  const likes = eventLikes.filter((l) => l.Event_ID === event.Event_ID);
                  const comments = eventComments.filter((c) => c.Event_ID === event.Event_ID);
                  return (
                    <EventCard key={event.Event_ID} event={event} eventLikes={likes} eventComments={comments} />
                  );
                })
              )}
            </Tab>
            <Tab eventKey="surveys" title={`Sondages (${userSurveys.length})`}>
              {userSurveys.length === 0 ? (
                <p className="empty-tab">Aucun sondage créé.</p>
              ) : (
                userSurveys.map((survey) => {
                  const survVotes = votes.filter((v) => v.Survey_ID === survey.Survey_ID);
                  const survLikes = surveyLikes.filter((l) => l.Survey_ID === survey.Survey_ID);
                  const survComments = surveyComments.filter((c) => c.Survey_ID === survey.Survey_ID);
                  return (
                    <SurveyCard key={survey.Survey_ID} survey={survey} surveyVotes={survVotes} surveyLikes={survLikes} surveyComments={survComments} />
                  );
                })
              )}
            </Tab>
          </Tabs>
        </div>
      </div>

      {/* Modal édition profil */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg" className="modals">
        <Modal.Header closeButton>
          <Modal.Title>Modifier le profil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ setFieldValue }) => (
              <Form>
                <div className="title-content">
                  <label htmlFor="username">Pseudo</label>
                  <Field name="username" type="text" className="form-control" />
                  <ErrorMessage name="username" component="div" className="error" />
                  {usernameError && <div className="error">{usernameError}</div>}

                  <label htmlFor="firstName">Prénom</label>
                  <Field name="firstName" type="text" className="form-control" />
                  <ErrorMessage name="firstName" component="div" className="error" />

                  <label htmlFor="lastName">Nom</label>
                  <Field name="lastName" type="text" className="form-control" />
                  <ErrorMessage name="lastName" component="div" className="error" />

                  <label htmlFor="email">E-mail</label>
                  <Field name="email" type="email" className="form-control" />
                  <ErrorMessage name="email" component="div" className="error" />
                  {emailError && <div className="error">{emailError}</div>}

                  <label htmlFor="phone">Téléphone</label>
                  <Field name="phone" type="text" className="form-control" />

                  <label htmlFor="birthDate">Date de naissance</label>
                  <Field name="birthDate" type="date" className="form-control" />

                  <label htmlFor="address">Adresse</label>
                  <Field name="address" type="text" className="form-control" />

                  <label htmlFor="gender">Genre</label>
                  <Field name="gender" as="select" className="form-control">
                    <option value="">Sélectionnez un genre</option>
                    <option value="Male">Homme</option>
                    <option value="Female">Femme</option>
                    <option value="Other">Autre</option>
                  </Field>

                  <label htmlFor="biography">Biographie</label>
                  <Field name="biography" as="textarea" rows="3" className="form-control" />
                </div>

                <div className="img-upload">
                  <label htmlFor="ProfileImageModal">
                    <i className="fa-solid fa-image" /> Changer la photo de profil
                  </label>
                  <input
                    id="ProfileImageModal"
                    name="ProfileImage"
                    type="file"
                    onChange={(e) => setFieldValue("ProfileImage", e.currentTarget.files[0])}
                  />
                </div>

                <hr style={{ margin: "1.5em 0" }} />
                <h6>Changer le mot de passe</h6>

                <div className="title-content">
                  <label htmlFor="password">Nouveau mot de passe</label>
                  <Field name="password" type="password" className="form-control" autoComplete="new-password" />

                  <label htmlFor="passwordConfirmation">Confirmer le mot de passe</label>
                  <Field name="passwordConfirmation" type="password" className="form-control" autoComplete="new-password" />
                </div>

                <Button type="submit" style={{ marginTop: "1em", width: "100%" }}>
                  Enregistrer
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default MyUserProfilScreen;
