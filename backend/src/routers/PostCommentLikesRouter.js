// PostCommentLikesRouter.js

const express = require("express");

const router = express.Router();
const postCommentLikesController = require("../controllers/PostCommentLikesController");

const { verifyToken } = require("../middleware/auth");

router.use(verifyToken);
router.get("/postCommentLikes", postCommentLikesController.getPostCommentLikes);

router.get(
  "/postCommentLikes/:id",
  postCommentLikesController.getPostCommentLikesByID
);

router.post(
  "/postCommentLikes",
  postCommentLikesController.createPostCommentLikes
);

router.delete(
  "/postCommentLikes/:id",
  postCommentLikesController.deletePostCommentLikes
);

module.exports = router;
