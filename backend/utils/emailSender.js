const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text, html }) => {
  // Configuration de Nodemailer pour Gmail
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "nyukeitthakkar@gmail.com", // Votre adresse Gmail
      pass: process.env.GMAIL_APP_PASS,
    },
  });

  // Options de l'email
  const mailOptions = {
    from: 'WorkSocial" <nyukeitthakkar@gmail.com>', // Expéditeur
    to, // Adresse du destinataire
    subject, // Sujet de l'email
    text:
      text ||
      `Bonjour et bienvenue, vous trouverez ici votre code de vérification : ${html}. Vous avez 15 minutes pour valider votre inscription.`, // Corps de l'email en texte brut
    html:
      html ||
      `<b>Bonjour et bienvenue, vous trouverez ici votre code de vérification : ${text}. Vous avez 15 minutes pour valider votre inscription.</b>`, // Corps de l'email en HTML
  };

  // Envoi de l'email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.info("Email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email: ", error);
    return false;
  }
};

module.exports = { sendEmail };
