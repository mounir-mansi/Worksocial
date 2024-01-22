import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../utils/useConnecte";

function CreateEvent() {
  // Fonction pour formater la date au format YYYY-MM-DD
  const formatDateString = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Fonction pour formater l'heure au format hh:mm:ss
  const formatTimeString = (timeString) => {
    const time = new Date(`1970-01-01T${timeString}`);
    const hours = String(time.getUTCHours()).padStart(2, "0");
    const minutes = String(time.getUTCMinutes()).padStart(2, "0");
    const seconds = String(time.getUTCSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };
  const { user, getUserId } = useAuth();
  // Utilisez le hook useFormik pour gérer le formulaire
  const formik = useFormik({
    initialValues: {
      User_ID: user ? getUserId() : null,
      Image: "",
      EventName: "",
      StartDate: "",
      EndDate: "",
      StartTime: "",
      EndTime: "",
      Description: "",
      Visibility: "Public", // définir la valeur par défaut
      ParticipantCount: 0, // définir la valeur par défaut
    },
    validationSchema: Yup.object({
      EventName: Yup.string().required("Champ requis"),
      StartDate: Yup.date().required("Champ requis"),
      EndDate: Yup.date().required("Champ requis"),
      StartTime: Yup.string().required("Champ requis"),
      EndTime: Yup.string().required("Champ requis"),
      Description: Yup.string().required("Champ requis"),
      Visibility: Yup.string().required("Champ requis"),
    }),

    onSubmit: (values) => {
      const dataToSend = {
        ...values,
        StartDate: formatDateString(values.StartDate),
        EndDate: formatDateString(values.EndDate),
        StartTime: formatTimeString(values.StartTime),
        EndTime: formatTimeString(values.EndTime),
      };
      console.info("Données à envoyer au backend :", dataToSend);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <label htmlFor="EventName">Nom de l'événement:</label>
      <input
        type="text"
        id="EventName"
        name="EventName"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.EventName}
      />
      {formik.touched.EventName && formik.errors.EventName ? (
        <div>{formik.errors.EventName}</div>
      ) : null}

      <label htmlFor="StartDate">Date de début:</label>
      <input
        type="date"
        id="StartDate"
        name="StartDate"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.StartDate}
      />
      {formik.touched.StartDate && formik.errors.StartDate ? (
        <div>{formik.errors.StartDate}</div>
      ) : null}

      <label htmlFor="EndDate">Date de fin:</label>
      <input
        type="date"
        id="EndDate"
        name="EndDate"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.EndDate}
      />
      {formik.touched.EndDate && formik.errors.EndDate ? (
        <div>{formik.errors.EndDate}</div>
      ) : null}

      <label htmlFor="StartTime">Heure de début:</label>
      <input
        type="time"
        id="StartTime"
        name="StartTime"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.StartTime}
      />
      {formik.touched.StartTime && formik.errors.StartTime ? (
        <div>{formik.errors.StartTime}</div>
      ) : null}

      <label htmlFor="EndTime">Heure de fin:</label>
      <input
        type="time"
        id="EndTime"
        name="EndTime"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.EndTime}
      />
      {formik.touched.EndTime && formik.errors.EndTime ? (
        <div>{formik.errors.EndTime}</div>
      ) : null}

      <label htmlFor="Description">Description:</label>
      <textarea
        id="Description"
        name="Description"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.Description}
      />
      {formik.touched.Description && formik.errors.Description ? (
        <div>{formik.errors.Description}</div>
      ) : null}

      <label htmlFor="Visibility">Visibilité:</label>
      <select
        id="Visibility"
        name="Visibility"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.Visibility}
      >
        <option value="Public">Public</option>
        <option value="Private">Privé</option>
      </select>
      {formik.touched.Visibility && formik.errors.Visibility ? (
        <div>{formik.errors.Visibility}</div>
      ) : null}

      <button type="submit">Envoyer</button>
    </form>
  );
}

export default CreateEvent;
