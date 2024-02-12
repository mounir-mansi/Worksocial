import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { Formik, Form, Field } from "formik";
// import * as Yup from "yup";

import { hostname } from "../../HostnameConnect/Hostname";

export default function ResetPassword() {
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const handleSubmit = async (values) => {
    const Email = values;
    console.info(Email);
    const response = await fetch(`${hostname}/verify-user`, {
      method: "POST",
      body: JSON.stringify(Email),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      setEmailSubmitted(true);
    }
  };

  return (
    <div className="container">
      <div>
        <h2 className="page-title">Mot de Passe Oublie?</h2>
        {emailSubmitted ? (
          <div className="alert alert-success" role="alert">
            Si l'email existe dans notre base de donnée, vous venez de recevoir
            un email avec un lien pour reinitialiser votre mot de passe.
          </div>
        ) : (
          <Formik initialValues={{ Email: "" }} onSubmit={handleSubmit}>
            <Form>
              <label htmlFor="Email">Email</label>
              <Field type="email" name="Email" />
              <Button type="submit">Envoyer</Button>
            </Form>
          </Formik>
        )}
      </div>
    </div>
  );
}
