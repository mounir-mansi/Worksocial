const prisma = require("../lib/prisma");

const getLikesBySurveyId = async (req, res) => {
  try {
    const surveyId = parseInt(req.params.surveyId, 10);
    const likes = await prisma.surveyLike.findMany({ where: { Survey_ID: surveyId } });
    res.send(likes);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const likeSurvey = async (req, res) => {
  try {
    const Survey_ID = parseInt(req.params.surveyId, 10);
    const User_ID = parseInt(req.body.userId, 10);
    await prisma.surveyLike.create({ data: { Survey_ID, User_ID } });
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const unlikeSurvey = async (req, res) => {
  try {
    const Survey_ID = parseInt(req.params.surveyId, 10);
    const User_ID = parseInt(req.body.userId, 10);
    await prisma.surveyLike.delete({ where: { Survey_ID_User_ID: { Survey_ID, User_ID } } });
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

module.exports = { getLikesBySurveyId, likeSurvey, unlikeSurvey };
