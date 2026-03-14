// Company Card
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Formik, Form, Field } from "formik";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Modal from "react-bootstrap/Modal";

import ImageWithJWT from "../../utils/ImageWithJWT";
import getImageUrl from "../../utils/getImageUrl";
import { hostname } from "../../HostnameConnect/Hostname";
import { useCompany } from "../../contexts/CompanyContext";

export default function CompanyCard({ company }) {
  const { getCompanies } = useCompany();
  const [showModal, setShowModal] = useState(false);
  const [showDelModal, setShowDelModal] = useState(false);

  const imageUrl = getImageUrl(company.Logo);

  const initialValues = {
    Name: company.Name || "",
    URL: company.URL || "",
    Phone: company.Phone || "",
    Email: company.Email || "",
    Activity: company.Activity || "",
    Address: company.Address || "",
    Logo: null,
  };

  const handleEditCompany = async (values) => {
    const { Name, URL, Phone, Email, Activity, Address, Logo } = values;
    const formData = new FormData();
    formData.append("Name", Name);
    formData.append("URL", URL);
    formData.append("Phone", Phone);
    formData.append("Email", Email);
    formData.append("Activity", Activity);
    formData.append("Address", Address);
    if (Logo && Logo instanceof File) {
      formData.append("Logo", Logo);
    }
    try {
      const response = await fetch(`${hostname}/company/${company.Company_ID}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });
      if (!response.ok) console.error("Erreur modification entreprise:", response.statusText);
      setShowModal(false);
      getCompanies();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleDeleteCompany = async () => {
    try {
      const response = await fetch(`${hostname}/company/${company.Company_ID}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) console.error("Erreur suppression entreprise:", response.statusText);
      setShowDelModal(false);
      getCompanies();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return (
    <div>
      <Card>
        <div className="card-header">
          <div className="profile" />
          <DropdownButton id="context-menu-btn" title="">
            <Dropdown.Item onClick={() => setShowModal(true)}>Modifier</Dropdown.Item>
            <Dropdown.Item onClick={() => setShowDelModal(true)}>Supprimer</Dropdown.Item>
          </DropdownButton>
        </div>
        <div className="card-img">
          <ImageWithJWT className="company-img" imageUrl={imageUrl} />
        </div>
        <Card.Body>
          <Card.Title>{company.Name}</Card.Title>
          <Card.Text>
            <strong>Site web :</strong> {company.URL}
            <br />
            <strong>Téléphone :</strong> {company.Phone}
            <br />
            <strong>Email :</strong> {company.Email}
            <br />
            <strong>Secteur :</strong> {company.Activity}
            <br />
            <strong>Adresse :</strong> {company.Address}
          </Card.Text>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} className="modals">
        <Modal.Header closeButton>
          <Modal.Title>Modifier l'entreprise</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik initialValues={initialValues} onSubmit={handleEditCompany} enableReinitialize>
            {({ setFieldValue }) => (
              <Form>
                <div className="title-content">
                  <label htmlFor="Name">Nom</label>
                  <Field name="Name" type="text" className="form-control" />
                  <label htmlFor="URL">Site web</label>
                  <Field name="URL" type="text" className="form-control" />
                  <label htmlFor="Phone">Téléphone</label>
                  <Field name="Phone" type="text" className="form-control" />
                  <label htmlFor="Email">Email</label>
                  <Field name="Email" type="email" className="form-control" />
                  <label htmlFor="Activity">Secteur d'activité</label>
                  <Field name="Activity" type="text" className="form-control" />
                  <label htmlFor="Address">Adresse</label>
                  <Field name="Address" type="text" className="form-control" />
                </div>
                <div className="img-upload">
                  <label htmlFor="CompanyLogo">
                    <i className="fa-solid fa-image" /> Changer l'image
                  </label>
                  <input
                    id="CompanyLogo"
                    name="Logo"
                    type="file"
                    onChange={(e) => setFieldValue("Logo", e.currentTarget.files[0])}
                  />
                </div>
                <Button type="submit" style={{ marginTop: "1em", width: "100%" }}>
                  Modifier
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      <Modal show={showDelModal} onHide={() => setShowDelModal(false)} className="modals">
        <Modal.Header closeButton>
          <Modal.Title>Supprimer l'entreprise</Modal.Title>
        </Modal.Header>
        <Modal.Body>Êtes-vous sûr de vouloir supprimer cette entreprise ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelModal(false)}>Annuler</Button>
          <Button variant="danger" onClick={handleDeleteCompany}>Supprimer</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

CompanyCard.propTypes = {
  company: PropTypes.shape({
    Company_ID: PropTypes.number.isRequired,
    Name: PropTypes.string.isRequired,
    URL: PropTypes.string.isRequired,
    Logo: PropTypes.string,
    Phone: PropTypes.string,
    Email: PropTypes.string,
    Activity: PropTypes.string,
    Address: PropTypes.string.isRequired,
  }).isRequired,
};
