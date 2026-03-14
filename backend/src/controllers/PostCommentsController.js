const prisma = require("../lib/prisma");

const getPostComments = async (req, res) => {
  try {
    const postID = parseInt(req.params.postID, 10);
    const comments = await prisma.postComment.findMany({
      where: { Post_ID: postID },
      orderBy: { Created_At: "asc" },
    });
    res.send(comments);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const getPostCommentByID = async (req, res) => {
  try {
    const comment = await prisma.postComment.findUnique({
      where: { Comment_ID: parseInt(req.params.id, 10) },
    });
    if (!comment) return res.sendStatus(404);
    res.send(comment);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
  return null;
};

const createPostComment = async (req, res) => {
  const postComment = req.body.comment;
  const postID = parseInt(req.params.postID, 10);
  const userID = req.User_ID;

  if (!postComment) {
    res.status(400).send("Missing comment");
    return;
  }

  try {
    const comment = await prisma.postComment.create({
      data: { Post_ID: postID, User_ID: userID, Comment: postComment },
    });
    res.location(`/posts/${postID}/comments/${comment.Comment_ID}`).status(201).send("Comment created");
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const updatePostComment = async (req, res) => {
  try {
    const commentID = parseInt(req.params.id, 10);
    const { Comment } = req.body;
    await prisma.postComment.update({ where: { Comment_ID: commentID }, data: { Comment } });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const deletePostComment = async (req, res) => {
  try {
    await prisma.postComment.delete({ where: { Comment_ID: parseInt(req.params.id, 10) } });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

module.exports = { getPostComments, getPostCommentByID, createPostComment, updatePostComment, deletePostComment };
