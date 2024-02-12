import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./ChangePassword.css";
import UserBar from "../../components/UserBar/UserBar";

import { hostname } from "../../HostnameConnect/Hostname";

function ChangePassword() {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const userIdLoggedIn = localStorage.getItem("userId");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${hostname}/users/${userIdLoggedIn}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorBody = await response.text();
          console.error(
            "Erreur lors de la récupération des données de l'utilisateur",
            errorBody
          );
          return;
        }

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données de l'utilisateur:",
          error
        );
      }
    };
    fetchUser();
  }, [userId]);
  const initialValues = {
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    username: "",
    lastName: "",
    firstName: "",
    birthDate: "",
    address: "",
    email: "",
    password: "",
    gender: "",
    phone: "",
    biography: "",
    ProfileImage: null,
  };

  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required("Mot de passe requis"),
    newPassword: Yup.string()
      .min(6, "Le mot de passe doit avoir au moins 6 caractères")
      .required("Mot de passe requis"),
    confirmNewPassword: Yup.string()
      .oneOf(
        [Yup.ref("newPassword"), null],
        "Les mots de passe doivent correspondre"
      )
      .required("La confirmation du mot de passe est requise"),
  });

  const handleSubmit = async (values) => {
    const { oldPassword, newPassword } = values;
    try {
      const verifyPasswordResponse = await fetch(
        `http://localhost:5000/users/checkOldPassword`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Password: oldPassword,
            Email: user.Email,
          }),
        }
      );

      if (!verifyPasswordResponse.ok) {
        // Afficher un message d'erreur approprié ou effectuer une action
        console.error("Ancien mot de passe incorrect");
        return;
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du mot de passe:", error);
      return;
    }

    // Si l'ancien mot de passe est correct, mettre à jour le mot de passe
    try {
      const updatePasswordResponse = await fetch(
        `http://localhost:5000/updatePassword/${userIdLoggedIn}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Password: newPassword,
          }),
        }
      );

      if (updatePasswordResponse.ok) {
        // Rediriger vers ConnexionScreen en cas de succès
        navigate("/ConnexionScreen");
      } else {
        // Gérer les erreurs de la mise à jour du mot de passe
        const contentType = updatePasswordResponse.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const data = await updatePasswordResponse.json();
          if (updatePasswordResponse.status === 409) {
            if (data.error.includes("nom d'utilisateur")) {
              console.error(
                "Ce pseudo est déjà utilisé. Veuillez choisir un autre pseudo."
              );
            }
            if (data.error.includes("email")) {
              console.error(
                "Cet email est déjà utilisé. Veuillez choisir un autre email."
              );
            }
          } else {
            console.error(
              "Une erreur est survenue lors de la mise à jour du mot de passe:",
              data.error
            );
          }
        } else {
          const text = await updatePasswordResponse.text();
          console.error(
            "Réponse non-JSON du serveur lors de la mise à jour du mot de passe:",
            text
          );
        }
      }
    } catch (error) {
      console.error(
        "Erreur lors de la requête de mise à jour du mot de passe:",
        error
      );
    }
  };
  if (!user) {
    return <div>Chargement...</div>;
  }
  return (
    <div className="container">
      <UserBar />
      <div>
        <h2 className="page-title">Changer votre mot de passe</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div className="form-group">
              <label htmlFor="oldPassword">Mot de Passe Actuel</label>
              <Field name="oldPassword" type="password" />
              <ErrorMessage
                name="oldPassword"
                component="div"
                className="error"
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">Nouveau Mot de Passe</label>
              <Field name="newPassword" type="password" />
              <ErrorMessage
                name="newPassword"
                component="div"
                className="error"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmNewPassword">
                Confirmer le Nouveau Mot de Passe
              </label>
              <Field name="confirmNewPassword" type="password" />
              <ErrorMessage
                name="confirmNewPassword"
                component="div"
                className="error"
              />
            </div>
            <Button type="submit">Changer le Mot de Passe</Button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default ChangePassword;
