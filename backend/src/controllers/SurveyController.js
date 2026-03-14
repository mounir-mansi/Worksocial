const prisma = require("../lib/prisma");
const { deleteS3Object } = require("../lib/deleteS3Object");

const getSurveys = async (_req, res) => {
  try {
    const surveys = await prisma.survey.findMany({ orderBy: { Created_At: "desc" } });
    res.send(surveys);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const getSurveyByID = async (req, res) => {
  try {
    const survey = await prisma.survey.findUnique({
      where: { Survey_ID: parseInt(req.params.id, 10) },
    });
    if (!survey) return res.sendStatus(404);
    res.send(survey);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
  return null;
};

const createSurvey = async (req, res) => {
  try {
    const { Title, Content, Visibility, EndDate, Option1, Option2, Option3, Option4 } = req.body;
    const Image = req.file ? `${process.env.S3_PUBLIC_URL}/${req.file.key}` : null;
    const survey = await prisma.survey.create({
      data: { Title, Content, Visibility, EndDate, Option1, Option2, Option3, Option4, Image, User_ID: req.User_ID },
    });
    res.location(`/surveys/${survey.Survey_ID}`).sendStatus(201);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const updateSurvey = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { Title, Content, Visibility, EndDate, Option1, Option2, Option3, Option4 } = req.body;
    const data = { Title, Content, Visibility, EndDate, Option1, Option2, Option3, Option4 };
    if (req.file) {
      const old = await prisma.survey.findUnique({ where: { Survey_ID: id }, select: { Image: true } });
      if (old?.Image) await deleteS3Object(old.Image);
      data.Image = `${process.env.S3_PUBLIC_URL}/${req.file.key}`;
    }
    await prisma.survey.update({ where: { Survey_ID: id }, data });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const deleteSurvey = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const survey = await prisma.survey.findUnique({ where: { Survey_ID: id }, select: { Image: true } });
    await prisma.survey.delete({ where: { Survey_ID: id } });
    if (survey?.Image) await deleteS3Object(survey.Image);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

module.exports = { getSurveys, getSurveyByID, createSurvey, updateSurvey, deleteSurvey };
