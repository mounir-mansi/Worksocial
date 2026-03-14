// UserFollowersRouter.js
const express = require("express");

const router = express.Router();
const userFollowersController = require("../controllers/UserFollowersController");

const { verifyToken } = require("../middleware/auth");

router.use(verifyToken);
router.get("/userFollowerss", userFollowersController.getUserFollowerss);

router.get("/userFollowerss/:id", userFollowersController.getUserFollowersByID);

router.post("/userFollowerss", userFollowersController.createUserFollowers);

router.delete(
  "/userFollowerss/:id",
  userFollowersController.deleteUserFollowers
);

module.exports = router;
