require("dotenv").config();

const mysql = require("mysql2/promise");

// create a connection pool to the database

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});
// try a connection

pool.getConnection().catch(() => {
  console.warn(
    "Warning:",
    "Failed to get a DB connection.",
    "Did you create a .env file with valid credentials?",
    "Routes using models won't work as intended"
  );
});

// declare and fill models: that's where you should register your own managers

const models = {};

const UserManager = require("./Manager/UserManager");

models.user = new UserManager();
models.user.setDatabase(pool);

const PostManager = require("./Manager/PostManager");

models.post = new PostManager();
models.post.setDatabase(pool);

const EventManager = require("./Manager/EventManager");

models.event = new EventManager();
models.event.setDatabase(pool);

const SurveyManager = require("./Manager/SurveyManager");

models.survey = new SurveyManager();
models.survey.setDatabase(pool);

const PostCommentManager = require("./Manager/PostCommentsManager");

models.postComments = new PostCommentManager();
models.postComments.setDatabase(pool);

const EventCommentsManager = require("./Manager/EventCommentsManager");

models.eventComments = new EventCommentsManager();
models.eventComments.setDatabase(pool);

const EventLikeManager = require("./Manager/EventLikeManager");

models.eventLike = new EventLikeManager();
models.eventLike.setDatabase(pool);

const EventCommentsLikesManager = require("./Manager/EventCommentsLikesManager");

models.eventCommentsLikes = new EventCommentsLikesManager();
models.eventCommentsLikes.setDatabase(pool);

const SurveyCommentsManager = require("./Manager/SurveyCommentsManager");

models.surveyComments = new SurveyCommentsManager();
models.surveyComments.setDatabase(pool);

const IndividualchatManager = require("./Manager/IndividualchatManager");

models.individualchat = new IndividualchatManager();
models.individualchat.setDatabase(pool);

const PostLikeManager = require("./Manager/PostLikeManager");

models.postLike = new PostLikeManager();
models.postLike.setDatabase(pool);

const SurveyLikeManager = require("./Manager/SurveyLikesManager");

models.surveyLike = new SurveyLikeManager();
models.surveyLike.setDatabase(pool);

const SurveyVoteManager = require("./Manager/SurveyVoteManager");

models.surveyVote = new SurveyVoteManager();
models.surveyVote.setDatabase(pool);

const TokenBlacklistManager = require("./Manager/TokenBlacklistManager");

models.tokenBlacklist = new TokenBlacklistManager();
models.tokenBlacklist.setDatabase(pool);

const ResetPasswordKeyManager = require("./Manager/ResetPasswordKeyManager");

models.resetPasswordKey = new ResetPasswordKeyManager();
models.resetPasswordKey.setDatabase(pool);

const CompanyUserManager = require("./Manager/CompanyUserManager");

models.company_user = new CompanyUserManager();
models.company_user.setDatabase(pool);
const CompaniesManager = require("./Manager/CompaniesManager");

models.company = new CompaniesManager();
models.company.setDatabase(pool);

// bonus: use a proxy to personalize error message,
// when asking for a non existing model

const handler = {
  get(obj, prop) {
    if (prop in obj) {
      return obj[prop];
    }

    const pascalize = (string) =>
      string.slice(0, 1).toUpperCase() + string.slice(1);

    throw new ReferenceError(
      `models.${prop} is not defined. Did you create ${pascalize(
        prop
      )}Manager.js, and did you register it in backend/src/models/index.js?`
    );
  },
};

module.exports = new Proxy(models, handler);
