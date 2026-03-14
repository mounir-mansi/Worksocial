const prisma = require("../lib/prisma");

const getEventCommentsLikes = async (req, res) => {
  try {
    const commentID = parseInt(req.params.commentID, 10);
    const likes = await prisma.eventCommentLike.findMany({ where: { Comment_ID: commentID } });
    res.send(likes);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const likeComment = async (req, res) => {
  try {
    const Comment_ID = parseInt(req.body.Comment_ID, 10);
    const User_ID = parseInt(req.body.User_ID, 10);
    await prisma.eventCommentLike.create({ data: { Comment_ID, User_ID } });
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const unlikeComment = async (req, res) => {
  try {
    await prisma.eventCommentLike.delete({ where: { Like_ID: parseInt(req.params.likeId, 10) } });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

module.exports = { getEventCommentsLikes, likeComment, unlikeComment };
