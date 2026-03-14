const prisma = require("../lib/prisma");

const likeComment = async (req, res) => {
  try {
    const Comment_ID = parseInt(req.params.commentId, 10);
    const User_ID = parseInt(req.body.User_ID, 10);
    await prisma.postCommentLike.create({ data: { Comment_ID, User_ID } });
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const unlikeComment = async (req, res) => {
  try {
    await prisma.postCommentLike.delete({ where: { Like_ID: parseInt(req.params.likeId, 10) } });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

module.exports = { likeComment, unlikeComment };
