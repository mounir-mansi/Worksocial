const prisma = require("../lib/prisma");

const getLikesByPostId = async (req, res) => {
  try {
    const postId = parseInt(req.params.postId, 10);
    const likes = await prisma.postLike.findMany({ where: { Post_ID: postId } });
    res.send(likes);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const likePost = async (req, res) => {
  try {
    const Post_ID = parseInt(req.params.postId, 10);
    const User_ID = parseInt(req.body.userId, 10);
    await prisma.postLike.create({ data: { Post_ID, User_ID } });
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const unlikePost = async (req, res) => {
  try {
    const Post_ID = parseInt(req.params.postId, 10);
    const User_ID = parseInt(req.body.userId, 10);
    await prisma.postLike.delete({ where: { Post_ID_User_ID: { Post_ID, User_ID } } });
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

module.exports = { getLikesByPostId, likePost, unlikePost };
