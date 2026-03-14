const prisma = require("../lib/prisma");

const getEventComments = async (req, res) => {
  try {
    const eventID = parseInt(req.params.eventID, 10);
    const comments = await prisma.eventComment.findMany({
      where: { Event_ID: eventID },
      orderBy: { Created_At: "asc" },
    });
    res.send(comments);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const getEventCommentByID = async (req, res) => {
  try {
    const comment = await prisma.eventComment.findUnique({
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

const createEventComment = async (req, res) => {
  const eventComment = req.body.comment;
  const eventID = parseInt(req.params.eventID, 10);
  const userID = req.User_ID;

  if (!eventComment) {
    res.status(400).send("Missing comment");
    return;
  }

  try {
    const comment = await prisma.eventComment.create({
      data: { Event_ID: eventID, User_ID: userID, Comment: eventComment },
    });
    res.location(`/events/${eventID}/comments/${comment.Comment_ID}`).status(201).send("Comment created");
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const updateEventComment = async (req, res) => {
  try {
    const commentID = parseInt(req.params.id, 10);
    const { Comment } = req.body;
    await prisma.eventComment.update({ where: { Comment_ID: commentID }, data: { Comment } });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const deleteEventComment = async (req, res) => {
  try {
    await prisma.eventComment.delete({ where: { Comment_ID: parseInt(req.params.id, 10) } });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

module.exports = { getEventComments, getEventCommentByID, createEventComment, updateEventComment, deleteEventComment };
