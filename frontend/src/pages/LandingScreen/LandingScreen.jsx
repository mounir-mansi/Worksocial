import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingScreen.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import heroImage from "../../assets/images/hero-image.png";
import footerLogo from "../../assets/images/logo.png";

export default function LandingScreen() {
  const navigate = useNavigate();
  const user = localStorage.getItem("userId");
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  });
  return (
    <div className="landing">
      <section id="hero" className="centered-text">
        <h1 id="hero-title">Trouvez votre connexion professionnelle</h1>
        <p id="hero-text">
          WorkSocial est le meilleur moyen de trouver des pairs et des collègues
          travaillant dans n'importe quelle entreprise.
        </p>
        <a className="hero-button" href ="/inscription">
          Commencez Gratuitement
        </a>
        <img src={heroImage} alt="Hero" id="hero-image" />
      </section>
      <div id="features" className="centered-text">
        <Row>
          <Col>
            <i className="fas fa-edit feature-icon" />
            <Card.Title className="feature-icon">Postes</Card.Title>
            <Card.Text>
              Lisez les messages et les mises à jour de vos contacts et comment
              ils améliorent leur vie professionnelle. Partagez les créant un
              article !
            </Card.Text>
          </Col>
          <Col>
            <i className="fas fa-calendar-alt feature-icon" />
            <Card.Title className="feature-icon">Events</Card.Title>
            <Card.Text>
              Créez des événements et invitez vos amis à y participer. Limitez
              les personnes qui peuvent voir vos événements grâce aux fonctions
              de confidentialité.
            </Card.Text>
          </Col>
          <Col>
            <i className="fas fa-poll feature-icon" />
            <Card.Title className="feature-icon">Surveys</Card.Title>
            <Card.Text>
              Créer des sondages et y participer. Recueillez l'opinion du public
              sur vos idées ou sur tout autre sujet d'actualité.
            </Card.Text>
          </Col>
        </Row>
      </div>
      <section id="chat" className="centered-text">
        <h2 id="features-title">Tchat avec d'autres professionnels</h2>
        <p id="hero-text">
          Tchatter et se connecter avec d'autres professionnels sur WorkSocial
          est aussi facile que de prendre son petit-déjeuner le matin.
        </p>
        <Row id="chat-features">
          <Col>
            <i className="fas fa-lock feature-icon" />
            <Card.Title className="feature-icon">Private</Card.Title>
            <Card.Text>
              Vos discussions sont privées et cryptées de bout en bout. Nous
              n'avons pas accès à vos discussions et nous ne les lisons pas.
            </Card.Text>
          </Col>
          <Col>
            <i className="fas fa-shield feature-icon" />
            <Card.Title className="feature-icon">Secure</Card.Title>
            <Card.Text>
              Le cryptage de bout en bout garantit que vos chats sont toujours
              sécurisés et protégés contre les intrusions extérieures.
            </Card.Text>
          </Col>
          <Col>
            <i className="fas fa-gauge-simple-high feature-icon" />
            <Card.Title className="feature-icon">Ultra Fast</Card.Title>
            <Card.Text>
              Nos systèmes de chat sont conçus avec un envoi multiple pour
              garantir des temps de réponse extrêmement rapides.
            </Card.Text>
          </Col>
        </Row>
        <a className="hero-button" href="/inscription">
          Commencez Gratuite
        </a>
      </section>
      <footer>
        <img src={footerLogo} alt="Logo" id="footer-logo" />
        <p id="footer-text">
          WorkSocial est le meilleur moyen de trouver des pairs et des collègues
          travaillant dans n'importe quelle entreprise.
        </p>
        <p>
          © {new Date().getFullYear()} WorkSocial. Créé avec ☕ et ❤️ en France
        </p>
      </footer>
    </div>
  );
}
