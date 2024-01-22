const express = require("express");

const router = express.Router();

const individualchatController = require("../controllers/IndividualchatController");

const { verifyToken } = require("../middleware/auth");

// Authentication Wall - Everything after this requires an authenticated user
router.use(verifyToken);

router.get("/individualchats", individualchatController.browse);
router.get(
  "/individualchats/:individualchatID",
  individualchatController.getIndividualchat
);
router.get(
  "/individualchats/user/:userId",
  individualchatController.getAllChatsForUser
);

router.post("/individualchats", individualchatController.createIndividualchat);
router.put(
  "/individualchats/:individualchatID",
  individualchatController.update
); // Utilisez PUT pour la modification
router.delete(
  "/individualchats/:individualchatID",
  individualchatController.deleteIndividualchat
);

module.exports = router;
