// import some node modules for later

const fs = require("node:fs");
const path = require("node:path");

// create express app

const express = require("express");
const app = express();
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://worksocialmounir.netlify.app');
  next();
});

// use some application-level middlewares

app.use(express.json());

const cors = require("cors");

app.use(cors());
app.use("/upload", express.static(path.join(__dirname, "../assets/upload")));

app.use(cors());
// app.use(express.urlencoded({ extended: true }));
// import and mount the API routes

const CompaniesRouter = require("./routers/CompaniesRouter");
const userRouter = require("./routers/UserRouter");
const postRouter = require("./routers/PostRouter");
const eventRouter = require("./routers/EventRouter");
const surveyRouter = require("./routers/SurveyRouter");
const postCommentsRouter = require("./routers/PostCommentsRouter");
const eventCommentsRouter = require("./routers/EventCommentsRouter");
const eventLikesRouter = require("./routers/EventlikeRouter");
const eventCommentsLikesRouter = require("./routers/EventCommentsLikesRouter");
const surveyCommentsRouter = require("./routers/SurveyCommentsRouter");
const individualchatRouter = require("./routers/IndividualchatRouter");
const PostLikeDislikeRouter = require("./routers/PostLikeDislikeRoutes");
const SurveyLikesRouter = require("./routers/SurveyLikesRouter");
const SurveyVoteRouter = require("./routers/SurveyVoteRouter");
const CompanyUserRouter = require("./routers/CompanyUserRouter");

app.use(CompaniesRouter);
app.use(userRouter);
app.use(postRouter);
app.use(eventRouter);
app.use(surveyRouter);
app.use(postCommentsRouter);
app.use(eventCommentsRouter);
app.use(eventLikesRouter);
app.use(eventCommentsLikesRouter);
app.use(surveyCommentsRouter);
app.use(individualchatRouter);
app.use(PostLikeDislikeRouter);
app.use(SurveyLikesRouter);
app.use(SurveyVoteRouter);
app.use(CompanyUserRouter);

// serve the `backend/public` folder for public resources
app.use("/upload", express.static(path.join(__dirname, "../assets/upload")));
app.use(express.static(path.join(__dirname, "../public")));

// serve REACT APP
const reactIndexFile = path.join(
  __dirname,
  "..",
  "..",
  "frontend",
  "dist",
  "index.html"
);

if (fs.existsSync(reactIndexFile)) {
  // serve REACT resources

  app.use(express.static(path.join(__dirname, "..", "..", "frontend", "dist")));

  // redirect all requests to the REACT index file

  app.get("*", (req, res) => {
    res.sendFile(reactIndexFile);
  });
}

// ready to export

module.exports = app;
