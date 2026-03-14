const prisma = require("../lib/prisma");

const getSurveycCommentLikes = async (_req, res) => {
  try {
    const likes = await prisma.surveyCommentLike.findMany();
    res.send(likes);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const getSurveycCommentLikesByID = async (req, res) => {
  try {
    const like = await prisma.surveyCommentLike.findUnique({
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

const createSurveycCommentLikes = async (req, res) => {
  try {
    const Comment_ID = parseInt(req.body.Comment_ID, 10);
    const User_ID = parseInt(req.body.User_ID, 10);
    const like = await prisma.surveyCommentLike.create({ data: { Comment_ID, User_ID } });
    res.location(`/surveycCommentLikes/${like.Like_ID}`).sendStatus(201);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const deleteSurveycCommentLikes = async (req, res) => {
  try {
    await prisma.surveyCommentLike.delete({ where: { Like_ID: parseInt(req.params.id, 10) } });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

module.exports = { getSurveycCommentLikes, getSurveycCommentLikesByID, createSurveycCommentLikes, deleteSurveycCommentLikes };
