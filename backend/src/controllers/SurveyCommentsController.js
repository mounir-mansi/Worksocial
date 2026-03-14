const prisma = require("../lib/prisma");

const getSurveyComments = async (req, res) => {
  try {
    const surveyID = parseInt(req.params.surveyID, 10);
    const comments = await prisma.surveyComment.findMany({
      where: { Survey_ID: surveyID },
      orderBy: { Created_At: "asc" },
    });
    res.send(comments);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const getSurveyCommentByID = async (req, res) => {
  try {
    const comment = await prisma.surveyComment.findUnique({
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

const createSurveyComment = async (req, res) => {
  const surveyComment = req.body.comment;
  const surveyID = parseInt(req.params.surveyID, 10);
  const userID = req.User_ID;

  if (!surveyComment) {
    res.status(400).send("Missing comment");
    return;
  }

  try {
    const comment = await prisma.surveyComment.create({
      data: { Survey_ID: surveyID, User_ID: userID, Comment: surveyComment },
    });
    res.location(`/surveys/${surveyID}/comments/${comment.Comment_ID}`).status(201).send("Comment added");
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const updateSurveyComment = async (req, res) => {
  try {
    const commentID = parseInt(req.params.id, 10);
    const { Comment } = req.body;
    await prisma.surveyComment.update({ where: { Comment_ID: commentID }, data: { Comment } });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const deleteSurveyComment = async (req, res) => {
  try {
    await prisma.surveyComment.delete({ where: { Comment_ID: parseInt(req.params.id, 10) } });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

module.exports = { getSurveyComments, getSurveyCommentByID, createSurveyComment, updateSurveyComment, deleteSurveyComment };
