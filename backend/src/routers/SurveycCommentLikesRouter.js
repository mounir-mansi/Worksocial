// SurveycCommentLikesRouter.js
const express = require("express");

const router = express.Router();
const surveycCommentLikesController = require("../controllers/SurveycCommentLikesController");

const { verifyToken } = require("../middleware/auth");

router.use(verifyToken);
router.get(
  "/surveycCommentLikes",
  surveycCommentLikesController.getSurveycCommentLikes
);

router.get(
  "/surveycCommentLikes/:id",
  surveycCommentLikesController.getSurveycCommentLikesByID
);

router.post(
  "/surveycCommentLikes",
  surveycCommentLikesController.createSurveycCommentLikes
);

router.delete(
  "/surveycCommentLikes/:id",
  surveycCommentLikesController.deleteSurveycCommentLikes
);

module.exports = router;
