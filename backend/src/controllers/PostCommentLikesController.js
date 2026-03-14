const prisma = require("../lib/prisma");

const getPostCommentLikes = async (_req, res) => {
  try {
    const likes = await prisma.postCommentLike.findMany();
    res.send(likes);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const getPostCommentLikesByID = async (req, res) => {
  try {
    const like = await prisma.postCommentLike.findUnique({
      where: { Like_ID: parseInt(req.params.id, 10) },
    });
    if (!like) return res.sendStatus(404);
    res.send(like);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
  return null;
};

const createPostCommentLikes = async (req, res) => {
  try {
    const Comment_ID = parseInt(req.body.Comment_ID, 10);
    const User_ID = parseInt(req.body.User_ID, 10);
    const like = await prisma.postCommentLike.create({ data: { Comment_ID, User_ID } });
    res.location(`/postCommentLikes/${like.Like_ID}`).sendStatus(201);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const deletePostCommentLikes = async (req, res) => {
  try {
    await prisma.postCommentLike.delete({ where: { Like_ID: parseInt(req.params.id, 10) } });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

module.exports = { getPostCommentLikes, getPostCommentLikesByID, createPostCommentLikes, deletePostCommentLikes };
