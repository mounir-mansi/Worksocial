import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import "./SendageScreen.css";

function CreateSurveyScreen() {
  const navigate = useNavigate();

  // Initial form values
  const initialValues = {
    Image: "",
    EventName: "",
    StartDate: "",
    EndDate: "",
    StartTime: "",
    EndTime: "",
    Description: "",
    Visibility: "",
    ParticipantCount: "",
  };

  // Form validation schema
  const validationSchema = Yup.object().shape({
    Image: Yup.string().url("Invalid URL").required("Image URL is required"),
    EventName: Yup.string().required("Event Name is required"),
    StartDate: Yup.date().required("Start Date is required"),
    EndDate: Yup.date().required("End Date is required"),
    StartTime: Yup.string().required("Start Time is required"),
    EndTime: Yup.string().required("End Time is required"),
    Description: Yup.string().required("Description is required"),
    Visibility: Yup.string().required("Visibility is required"),
    ParticipantCount: Yup.number()
      .integer("Participant Count must be an integer")
      .min(0, "Participant Count must be greater than or equal to 0")
      .required("Participant Count is required"),
  });

  // Handle form submission
  const handleSubmit = (values, { setSubmitting }) => {
    // Simulate API request to create a survey
    setTimeout(() => {
      console.info("Survey data:", values);
      // Redirect to a different route after successful submission
      navigate("/surveys");
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="container">
      <h2>Create a New Survey</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="Image">Image URL</label>
              <Field type="text" name="Image" />
              <ErrorMessage name="Image" component="div" />
            </div>
            <div>
              <label htmlFor="EventName">Event Name</label>
              <Field type="text" name="EventName" />
              <ErrorMessage name="EventName" component="div" />
            </div>
            <div>
              <label htmlFor="StartDate">Start Date</label>
              <Field type="date" name="StartDate" />
              <ErrorMessage name="StartDate" component="div" />
            </div>
            <div>
              <label htmlFor="EndDate">End Date</label>
              <Field type="date" name="EndDate" />
              <ErrorMessage name="EndDate" component="div" />
            </div>
            <div>
              <label htmlFor="StartTime">Start Time</label>
              <Field type="text" name="StartTime" />
              <ErrorMessage name="StartTime" component="div" />
            </div>
            <div>
              <label htmlFor="EndTime">End Time</label>
              <Field type="text" name="EndTime" />
              <ErrorMessage name="EndTime" component="div" />
            </div>
            <div>
              <label htmlFor="Description">Description</label>
              <Field as="textarea" name="Description" />
              <ErrorMessage name="Description" component="div" />
            </div>
            <div>
              <label htmlFor="Visibility">Visibility</label>
              <Field type="text" name="Visibility" />
              <ErrorMessage name="Visibility" component="div" />
            </div>
            <div>
              <label htmlFor="ParticipantCount">Participant Count</label>
              <Field type="number" name="ParticipantCount" />
              <ErrorMessage name="ParticipantCount" component="div" />
            </div>
            <div>
              <button type="submit" disabled={isSubmitting}>
                Create Survey
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default CreateSurveyScreen;
