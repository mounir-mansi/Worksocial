import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

import "./InscriptionScreen.css";

function InscriptionScreen() {
  const navigate = useNavigate();
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const initialValues = {
    username: "",
    lastName: "",
    firstName: "",
    birthDate: "",
    address: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    gender: "",
    phone: "",
    biography: "",
    ProfileImage: null,
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Pseudo requis"),
    lastName: Yup.string().required("Nom requis"),
    firstName: Yup.string().required("Prénom requis"),
    birthDate: Yup.date().required("Date de naissance requise"),
    address: Yup.string().required("Adresse requise"),
    email: Yup.string().email("Email invalide").required("Email requis"),
    password: Yup.string()
      .min(6, "Le mot de passe doit avoir au moins 6 caractères")
      .required("Mot de passe requis"),
    passwordConfirmation: Yup.string()
      .oneOf(
        [Yup.ref("password"), null],
        "Les mots de passe doivent correspondre"
      )
      .required("La confirmation du mot de passe est requise"),
    gender: Yup.string().required("Genre requis"),
    phone: Yup.string().required("Téléphone requis"),
    biography: Yup.string().required("Biographie requise"),
    ProfileImage: Yup.mixed().required("Image requise"),
  });

  const calculateAge = (birthDate) => {
    const birthday = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const m = today.getMonth() - birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
      // eslint-disable-next-line no-plusplus
      age--;
    }
    return age;
  };

  const handleSubmit = async (values) => {
    const {
      username,
      lastName,
      firstName,
      birthDate,
      address,
      email,
      password,
      gender,
      ProfileImage,
      biography,
      phone,
    } = values;

    const age = calculateAge(birthDate);

    if (age < 18) {
      // eslint-disable-next-line no-alert
      alert("Vous devez avoir au moins 18 ans pour vous inscrire.");
      return;
    }

    const formData = new FormData();
    formData.append("Username", username);
    formData.append("LastName", lastName);
    formData.append("FirstName", firstName);
    formData.append("BirthDate", birthDate);
    formData.append("Age", age.toString());
    formData.append("Address", address);
    formData.append("Email", email);
    formData.append("Password", password);
    formData.append("Role", "User");
    formData.append("Gender", gender);
    formData.append("Phone", phone);
    formData.append("Biography", biography);
    if (values.password !== values.passwordConfirmation) {
      // Affichez un message d'erreur ou effectuez une action appropriée
      console.error("Les mots de passe ne correspondent pas");
      return;
    }
    if (ProfileImage && ProfileImage instanceof File) {
      formData.append("ProfileImage", ProfileImage);
    }
    try {
      const response = await fetch("http://localhost:5000/users", {
        method: "POST",
        body: formData,
      });

      // Check if the response is OK (status code 200-299)
      if (response.ok) {
        // Navigate to ConnexionScreen on successful response
        navigate("/ConnexionScreen");
      } else {
        // If the response status is not OK, handle errors
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          // Handle JSON response
          const data = await response.json();
          if (response.status === 409) {
            if (data.error.includes("nom d'utilisateur")) {
              setUsernameError(
                "Ce pseudo est déjà utilisé. Veuillez choisir un autre pseudo."
              );
            }
            if (data.error.includes("email")) {
              setEmailError(
                "Cet email est déjà utilisé. Veuillez choisir un autre email."
              );
            }
          } else {
            console.error(
              "Une erreur est survenue lors de l'inscription:",
              data.error
            );
          }
        } else {
          // Handle non-JSON response
          const text = await response.text();
          console.error("Non-JSON response from the server:", text);
        }
      }
    } catch (error) {
      // Handle network error or request failure
      console.error("Erreur lors de la requête:", error);
    }
  };

  return (
    <div className="inscription-screen">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form>
            <h2>Inscription</h2>
            <div className="form-group">
              <label htmlFor="username">Pseudo</label>
              <Field name="username" type="text" />
              <ErrorMessage name="username" component="div" className="error" />
              {usernameError && (
                <div className="error-message">{usernameError}</div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Nom</label>
              <Field name="lastName" type="text" />
              <ErrorMessage name="lastName" component="div" className="error" />
            </div>
            <div className="form-group">
              <label htmlFor="firstName">Prénom</label>
              <Field name="firstName" type="text" />
              <ErrorMessage
                name="firstName"
                component="div"
                className="error"
              />
            </div>
            <div className="form-group">
              <label htmlFor="birthDate">Date de Naissance</label>
              <Field name="birthDate" type="date" />
              <ErrorMessage
                name="birthDate"
                component="div"
                className="error"
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Adresse</label>
              <Field name="address" type="text" />
              <ErrorMessage name="address" component="div" className="error" />
            </div>
            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <Field name="email" type="email" />
              <ErrorMessage name="email" component="div" className="error" />
              {emailError && <div className="error-message">{emailError}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="phone">Téléphone</label>
              <Field name="phone" type="text" />
              <ErrorMessage name="phone" component="div" className="error" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Mot de Passe</label>
              <Field name="password" type="password" />
              <ErrorMessage name="password" component="div" className="error" />
            </div>
            <div className="form-group">
              <label htmlFor="passwordConfirmation">
                Confirmer le Mot de Passe
              </label>
              <Field name="passwordConfirmation" type="password" />
              <ErrorMessage
                name="passwordConfirmation"
                component="div"
                className="error"
              />
            </div>
            <div className="form-group">
              <label htmlFor="gender">Genre</label>
              <Field name="gender" as="select">
                <option value="">Sélectionnez un genre</option>
                <option value="Male">Homme</option>
                <option value="Female">Femme</option>
                <option value="Other">Autre</option>
              </Field>

              <ErrorMessage name="gender" component="div" className="error" />
            </div>
            <div className="form-group">
              <label htmlFor="ProfileImage">Image de Profil</label>
              <input
                id="ProfileImage"
                name="ProfileImage"
                type="file"
                onChange={(event) =>
                  setFieldValue("ProfileImage", event.currentTarget.files[0])
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="biography">Biographie</label>
              <Field name="biography" as="textarea" />
              <ErrorMessage
                name="biography"
                component="div"
                className="error"
              />
            </div>
            <button type="submit">S'inscrire</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default InscriptionScreen;
