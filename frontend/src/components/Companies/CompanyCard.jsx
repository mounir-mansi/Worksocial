// Company Card
import PropTypes from "prop-types";

import Card from "react-bootstrap/Card";

import ImageWithJWT from "../../utils/ImageWithJWT";
import getImageUrl from "../../utils/getImageUrl";

// import { useCompany } from "../../contexts/CompanyContext";

export default function CompanyCard({ company }) {
  const imageUrl = getImageUrl(company.Logo);

  return (
    <div>
      <Card>
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
