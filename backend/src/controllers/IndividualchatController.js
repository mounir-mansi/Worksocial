const models = require("../models");

const browse = (req, res) => {
  models.individualchat
    .findAll()
    .then(([rows]) => {
      res.send(rows);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const getAllChatsForUser = (req, res) => {
  models.individualchat
    .findAllByUserId(req.params.userId)
    .then(([rows]) => {
      console.info("Résultats de la base de données:", rows);
      res.send(rows);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const getIndividualchat = (req, res) => {
  models.individualchat
    .findByIndividualchatId(req.params.individualchatID)
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

const createIndividualchat = (req, res) => {
  const individualchat = req.body;

  models.individualchat
    .insert(individualchat)
    .then((result) => {
      const { insertId } = result; // Obtention de l'ID inséré
      res.status(201).json({
        message: "Message créé avec succès",
        chatId: insertId,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Erreur interne du serveur" });
    });
};

const deleteIndividualchat = (req, res) => {
  models.individualchat
    .delete(req.params.individualchatID)
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

const update = (req, res) => {
  const individualchat = req.body;
  individualchat.id = parseInt(req.params.individualchatID, 10);
  models.individualchat
    .update(individualchat)
    .then(([result]) => {
      if (result.length === 0) {
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

module.exports = {
  browse,
  getAllChatsForUser,
  getIndividualchat,
  createIndividualchat,
  deleteIndividualchat,
  update,
};
