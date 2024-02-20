const crypto = require("crypto");
const { sendEmail } = require("../../utils/emailSender");
const models = require("../models");
const { generateVerificationCode } = require("../../utils/helperFunctions");

const login = async (req, res, next) => {
  const Email = req.body;
  await models.user
    .login(Email)
    .then(([result]) => {
      if (result.length === 0) {
        // User not found
        res.status(401).json({ emailNotFound: true });
      } else {
        const user = result[0];
        // Pass the entire user object to auth.js for password verification
        req.user = user;
        next(); // Proceed to password verification in the auth middleware
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const getUsers = (req, res) => {
  models.user
    .findAll()
    .then(([rows]) => {
      res.send(rows);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const getUserByID = (req, res) => {
  models.user
    .findByPK(req.params.id)
    .then(([rows]) => {
      if (rows[0] == null) {
        res.sendStatus(404);
      } else {
        res.send(rows[0]);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const updateUser = (req, res) => {
  const user = req.body;
  const userID = req.User_ID;
  user.id = parseInt(req.params.id, 10);

  models.user
    .update(user, userID)
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.sendStatus(404);
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const updatePassword = async (req, res) => {
  const user = req.body;
  const userID = req.User_ID;
  user.id = parseInt(req.params.id, 10);

  try {
    const result = await models.user.updatePassword(user, userID);

    if (result.affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const createUser = (req, res) => {
  const user = req.body;
  console.info(user);

  // Ajouter le chemin de l'image de profil à l'objet user si une image est téléchargée
  if (req.file) {
    user.ProfileImage = req.file.filename; // Utilisez seulement le nom du fichier
  }

  models.user
    .insert(user)
    .then(([result]) => {
      res.location(`/users/${result.insertId}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const deleteUser = async (req, res, next) => {
  const emailInput = req.body.Email;

  const [user] = await models.user.findByPK(req.params.id);
  const userEmail = user[0].Email;

  if (emailInput === userEmail) {
    next();
  } else {
    res.sendStatus(403);
  }

  models.user
    .delete(emailInput)
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.sendStatus(404);
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const logout = async (req, res) => {
  try {
    const token = req.headers.authorization.replace(/^Bearer\s+/, "");
    models.tokenBlacklist.insert(token).then(([result]) => {
      if (result.affectedRows === 0) {
        res.sendStatus(404);
      } else {
        res.sendStatus(204);
      }
    });
  } catch (error) {
    res.status(500).send({ message: "Error logging out" });
  }
};

const getUserByEmail = async (req, res) => {
  const { Email } = req.body;
  console.info(Email);
  try {
    const user = await models.user.findUserByEmail(Email);
    if (user != null) {
      const uniqueKey = crypto.randomBytes(32).toString("hex");
      res.status(200).send({ uniqueKey, Email });
      models.resetPasswordKey.addKey(uniqueKey, Email);
      const emailUser = await sendEmail({
        to: "nyukeit@outlook.com",
        subject: "Re-initialiser votre Mot de Passe",
        text: `Bonjour, vous avez demandez la re-initialisation de votre mot de passe. Veuillez cliquer sur ce lien pour changer votre mot de passe : http://localhost:5173/resetpassword/${uniqueKey}`,
        html: `Bonjour, vous avez demandez la re-initialisation de votre mot de passe. Veuillez cliquer sur ce lien pour changer votre mot de passe : http://localhost:5173/resetpassword/${uniqueKey}`,
      });
      if (emailUser) {
        console.info("Email sent");
      } else {
        console.info("Email not sent");
      }
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving data from database");
  }
};

const verifyKey = async (req, res) => {
  const { key } = req.body;
  console.info(key);
  const [result] = await models.resetPasswordKey.getResetPasswordKey(key);
  if (result[0].unique_key === key) {
    const currentTime = new Date();
    const expirationTime = new Date(result[0].expires_at);
    let keyExpired = false;
    try {
      if (currentTime > expirationTime) {
        keyExpired = true;
        res.status(400).send(keyExpired);
      }
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  }
};

const resetPassword = async (req, res) => {
  const { hashedPassword, key } = req.body;
  console.info(hashedPassword, key);
  if (!key) {
    res.sendStatus(400);
    return;
  }
  await models.resetPasswordKey.getResetPasswordKey(key).then(([result]) => {
    if (result[0].unique_key === key) {
      try {
        models.user
          .resetPassword(hashedPassword, result[0].Email)
          .then(([r]) => {
            if (r.affectedRows === 0) {
              res.sendStatus(404);
            } else {
              res.sendStatus(204);
            }
          });
      } catch (err) {
        console.error(err);
        res.sendStatus(500);
      }
    }
  });
};

const getUserByEmailWithPasswordAndPassToNext = (req, res, next) => {
  const email = req.body;
  models.user
    .findUserByEmail(email.Email)
    .then(([users]) => {
      if (users[0] != null) {
        const [firstUser] = users;
        req.user = firstUser;
        next();
      } else {
        res.sendStatus(401);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const verifyUsernameAvailability = async (req, res) => {
  const { username } = req.query;
  try {
    const isAvailable = await models.user.checkUsernameAvailability(username);
    res.json({ isAvailable });
  } catch (error) {
    console.error(
      "Erreur lors de la vérification du nom d'utilisateur:",
      error
    );
    res.status(500).send("Erreur interne du serveur");
  }
};

const verifyEmailAvailability = async (req, res) => {
  const { email } = req.query;
  try {
    const isAvailable = await models.user.checkEmailAvailability(email);
    res.json({ isAvailable });
  } catch (error) {
    console.error("Erreur lors de la vérification de l'email:", error);
    res.status(500).send("Erreur interne du serveur");
  }
};
const verifyPhoneAvailability = async (req, res) => {
  const { phone } = req.query;
  try {
    const isAvailable = await models.user.checkPhoneAvailability(phone);
    res.json({ isAvailable });
  } catch (error) {
    console.error("Erreur lors de la vérification du téléphone:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};
const requestEmailVerification = async (req, res) => {
  const { userId, email } = req.body;

  // Vérifier si l'utilisateur existe
  try {
    const [user] = await models.user.findByPK(userId);
    if (!user || user.length === 0) {
      return res.status(404).send({ message: "User not found" });
    }

    const code = generateVerificationCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    await models.user.insertVerificationCode(userId, code, expiresAt);

    // Préparation et envoi de l'email
    const emailSent = await sendEmail({
      to: email,
      subject: "Code de vérification",
      text: `Bonjour et bienvenue, vous trouverez ici votre code de vérification : ${code}. Vous avez 15 minutes pour valider votre inscription.`,
      html: `<b>Bonjour et bienvenue, vous trouverez ici votre code de vérification : ${code}. Vous avez 15 minutes pour valider votre inscription.</b>`,
    });

    if (emailSent) {
      res.status(200).send({ message: "Verification code sent to email." });
    } else {
      throw new Error("Failed to send verification email.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error requesting email verification" });
  }
  return null;
};

const verifyEmailCode = async (req, res) => {
  const { userId, code } = req.body;

  try {
    const [results] = await models.user.findVerificationCode(userId, code);
    if (results.length > 0) {
      // Le code est valide, marquer l'email comme vérifié
      await models.user.markEmailAsVerified(userId);
      // Supprimer le code de vérification pour éviter sa réutilisation
      await models.user.deleteVerificationCode(userId, code);
      res.status(200).send({ message: "Email verified successfully." });
    } else {
      // Le code est invalide ou a expiré
      res
        .status(400)
        .send({ message: "Invalid or expired verification code." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error verifying email code." });
  }
};

module.exports = {
  getUsers,
  getUserByID,
  updateUser,
  createUser,
  deleteUser,
  login,
  logout,
  getUserByEmailWithPasswordAndPassToNext,
  updatePassword,
  verifyUsernameAvailability,
  verifyEmailAvailability,
  verifyPhoneAvailability,
  requestEmailVerification,
  verifyEmailCode,
  getUserByEmail,
  resetPassword,
  verifyKey,
};
