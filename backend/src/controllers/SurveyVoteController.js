const prisma = require("../lib/prisma");

const getVotesBySurveyId = async (req, res) => {
  try {
    const surveyId = parseInt(req.params.surveyId, 10);
    const votes = await prisma.surveyVote.findMany({ where: { Survey_ID: surveyId } });
    res.send(votes);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const castVote = async (req, res) => {
  try {
    const Survey_ID = parseInt(req.params.surveyId, 10);
    const User_ID = parseInt(req.body.userId, 10);
    const { votedOption } = req.body;
    await prisma.surveyVote.upsert({
      where: { Survey_ID_User_ID: { Survey_ID, User_ID } },
      update: { Voted_For: votedOption },
      create: { Survey_ID, User_ID, Voted_For: votedOption },
    });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

module.exports = { getVotesBySurveyId, castVote };
