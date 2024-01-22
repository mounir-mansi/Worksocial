import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

import "./CreateEventScreen.css";

function CreateEvent() {
  const navigate = useNavigate();

  // Initialisation des valeurs par défaut du formulaire
  const initialValues = {
    Image: null,
    EventName: "",
    StartDate: "",
    EndDate: "",
    StartTime: "",
    EndTime: "",
    Description: "",
    Visibility: "",
  };

  // Schéma de validation avec Yup
  const validationSchema = Yup.object().shape({
    Image: Yup.mixed().required("Image requise"),
    EventName: Yup.string().required("Nom de l'événement requis"),
    StartDate: Yup.date().required("Date de commencement requise"),
    EndDate: Yup.date().required("Date de fin requise"),
    StartTime: Yup.string().required("Heure de commencement requise"),
    EndTime: Yup.string().required("Heure de fin requise"),
    Description: Yup.string().required("Description requise"),
  });

  // Fonction de soumission du formulaire
  const handleSubmit = async (values) => {
    // Gérer la logique de soumission du formulaire ici
    console.info("Formulaire soumis avec les valeurs :", values);
    // Ajouter la logique pour envoyer les données au serveur ou effectuer d'autres actions

    // Redirection vers une autre page
    navigate("/success"); // Modifier la route selon vos besoins
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
            <h2>Créer un Événement</h2>
            <div className="form-group">
              <label htmlFor="EventName">Event Name</label>
              <Field name="EventName" type="text" />
            </div>

            <div className="form-group">
              <label htmlFor="StartDate">Start Date</label>
              <Field name="StartDate" type="date" />
              <label htmlFor="EndDate">End Date</label>
              <Field name="EndDate" type="date" />
            </div>

            <div className="form-group">
              <label htmlFor="Description">Description Event</label>
              <Field name="Description" as="textarea" />
            </div>

            <div className="form-group">
              <label htmlFor="StartTime">Start Time</label>
              <Field name="StartTime" type="time" />
              <label htmlFor="EndTime">End Time</label>
              <Field name="EndTime" type="time" />
            </div>

            <div className="form-group">
              <label htmlFor="Visibility">
                Qui peut Participer à l'évenement ?
              </label>
              <Field name="Visibility" as="select">
                <option value="all">all</option>
                <option value="friends">friends</option>
              </Field>
            </div>

            <div className="form-group">
              <label htmlFor="Image">Image</label>
              <input
                id="Image"
                name="Image"
                type="file"
                onChange={(event) =>
                  setFieldValue("ProfileImage", event.currentTarget.files[0])
                }
              />
            </div>

            <button type="submit">Valider</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default CreateEvent;
