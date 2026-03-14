// Companies Screen
import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";

import { Button, Modal } from "react-bootstrap";
import CompanyCard from "../../components/Companies/CompanyCard";
import UserBar from "../../components/UserBar/UserBar";

import { useCompany } from "../../contexts/CompanyContext";
import { hostname } from "../../HostnameConnect/Hostname";

export default function CompaniesScreen() {
  const [showModal, setShowModal] = useState(false);
  const { companies, getCompanies } = useCompany();

  useEffect(() => {
    getCompanies(); // Appel de la fonction pour obtenir les entreprises lors du chargement
  }, []);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const initialValues = {
    Logo: null,
    Name: "",
    URL: "",
    Phone: "",
    Email: "",
    Activity: "",
    Address: "",
  };

  const handleCreateCompany = async (values) => {
    const { Logo, Name, URL, Phone, Email, Activity, Address } = values;
    try {
      const formData = new FormData();
      formData.append("Name", Name);
      formData.append("URL", URL);
      formData.append("Logo", Logo);
      formData.append("Phone", Phone);
      formData.append("Email", Email);
      formData.append("Activity", Activity);
      formData.append("Address", Address);

      await fetch(`${hostname}/company`, {
        method: "POST",
        body: formData,
        credentials: 'include',
      }).then((res) => {
        if (res.ok) {
          console.info(res);
          getCompanies(); // Rafraîchi la liste des entreprises après création
        } else {
          console.error("Erreur lors de la requête :", res.statusText);
        }
      });

      handleCloseModal();
    } catch (error) {
      console.error("Erreur lors de la requête :", error);
    }
  };

  return (
    <div className="container">
      <UserBar />
      <div className="content-area">
        {companies.map((company) => (
          <CompanyCard key={company.Company_ID} company={company} />
        ))}
      </div>
      <div className="sidebar">
        <div className="sidebar-item">
          <h3>Entreprises</h3>
          <Button className="create-btn" onClick={handleOpenModal} style={{ width: "100%" }}>
            <i className="fas fa-plus" /> Créer une entreprise
          </Button>
        </div>
      </div>
      <Modal show={showModal} onHide={handleCloseModal} className="modals">
        <Modal.Header closeButton><Modal.Title>Créer une entreprise</Modal.Title></Modal.Header>
        <Modal.Body>
          <Formik initialValues={initialValues} onSubmit={handleCreateCompany}>
            {({ setFieldValue }) => (
              <Form>
                <div className="title-content">
                  <label htmlFor="Name">Nom de l'entreprise</label>
                  <Field name="Name" placeholder="Nom de l'entreprise" type="text" className="form-control" />
                  <label htmlFor="URL">Site web</label>
                  <Field name="URL" placeholder="https://..." type="text" className="form-control" />
                  <label htmlFor="Logo">Logo</label>
                  <input name="Logo" type="file" onChange={(e) => setFieldValue("Logo", e.currentTarget.files[0])} />
                  <label htmlFor="Phone">Téléphone</label>
                  <Field name="Phone" placeholder="Téléphone" type="text" className="form-control" />
                  <label htmlFor="Email">Email</label>
                  <Field name="Email" placeholder="Email" type="email" className="form-control" />
                  <label htmlFor="Activity">Secteur d'activité</label>
                  <Field name="Activity" placeholder="Secteur d'activité" type="text" className="form-control" />
                  <label htmlFor="Address">Adresse</label>
                  <Field name="Address" placeholder="Adresse" type="text" className="form-control" />
                </div>
                <Button id="createCompany-btn" type="submit" style={{ marginTop: "1em", width: "100%" }}>
                  Créer
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
}
