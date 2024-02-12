import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { Formik, Form, Field } from "formik";
import { useParams, useNavigate } from "react-router-dom";
import * as Yup from "yup";

import { hostname } from "../../HostnameConnect/Hostname";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { key } = useParams();
  const [keyExpired, setKeyExpired] = useState(false);
  const userLoggedIn = localStorage.getItem("userId");

  const verifyKey = async () => {
    const response = await fetch(`${hostname}/verify-key`, {
      method: "POST",
      body: JSON.stringify({ key }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      setKeyExpired(true);
    } else {
      const data = await response.json();
      if (data.keyExpired) {
        setKeyExpired(true);
      }
    }
  };

  useEffect(() => {
    if (userLoggedIn) {
      navigate(`/profile/${userLoggedIn}`);
    }
    if (key) {
      verifyKey();
    }

    // if (keyExpired) {
    //   setTimeout(() => {
    //     console.info();
    //   }, 5000);
    // }
  }, [key]);

  const handlePasswordSubmit = async (values) => {
    const { Password } = values;
    const response = await fetch(`${hostname}/reset-password`, {
      method: "POST",
      body: JSON.stringify({ Password, key }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      navigate("/connexion");
    }
    const data = await response.json();
    console.info(data);
    if (data) {
      setKeyExpired(true);
    }
  };

  const validationSchema = Yup.object().shape({
    Password: Yup.string()
      .required("Le mot de passe est requis")
      .min(6, "Le mot de passe doit avoir au moins 6 caractères"),
    RepeatPassword: Yup.string()
      .oneOf(
        [Yup.ref("Password"), null],
        "Les mots de passe ne sont pas identiques"
      )
      .required("Le confirmation du mot de passe est requis"),
  });

  return (
    <div className="container">
      {keyExpired ? (
        <p>
          La clé de réinitialisation du mot de passe a expiré. Veuillez demander
          une nouvelle clé <a href="/verify-user">ici</a>
        </p>
      ) : (
        <div>
          {!key ? (
            <p>
              Vous êtes sur la page de réinitialisation du mot de passe{" "}
              <strong>sans clé valide ou clé expiré</strong>. Si vous avez
              oublié votre mot de passe, veuillez en demander un nouveau{" "}
              <a href="/verify-user">ici</a>.
            </p>
          ) : (
            <Formik
              initialValues={{ Password: "" }}
              validationSchema={validationSchema}
              onSubmit={handlePasswordSubmit}
            >
              <Form>
                <label htmlFor="Password">Nouveau Password</label>
                <Field type="password" name="Password" />
                <label htmlFor="RepeatPassword">
                  Confirmer Nouveau Password
                </label>
                <Field type="password" name="RepeatPassword" />
                <Button type="submit">Envoyer</Button>
              </Form>
            </Formik>
          )}
        </div>
      )}
    </div>
  );
}
