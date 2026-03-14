// import some node modules for later

const fs = require("node:fs");
const path = require("node:path");

// create express app

const express = require("express");
const helmet = require("helmet");

const app = express();

// Helmet — headers HTTP de sécurité (anti-XSS, anti-clickjacking, HTTPS forcé, etc.)
app.use(helmet());

app.use(express.json());

const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

// Rate limit — max 10 requêtes par IP toutes les 15 minutes sur les routes sensibles
// Bloque les attaques brute-force sur les mots de passe et le spam d'inscriptions
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 10 : 50,
  message: { error: "Trop de tentatives. Réessaie dans 15 minutes." },
});

// CORS — liste blanche d'origines autorisées (env + IP locale pour Expo sur vrai téléphone)
const allowedOrigins = [
  process.env.CORS_ORIGIN,
  process.env.CORS_ORIGIN_WEB,
  process.env.CORS_ORIGIN_DEV,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Autoriser les requêtes sans origine (ex: mobile natif, Postman)
      if (!origin) return callback(null, true);
      // En dev : autoriser tous les localhost
      if (process.env.NODE_ENV !== "production" && /^http:\/\/localhost(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("CORS: origine non autorisée"));
    },
    credentials: true,
  })
);

// cookie-parser — permet à Express de lire req.cookies (pour le JWT httpOnly)
app.use(cookieParser());

// Appliquer le rate limit sur les routes sensibles (auth uniquement, pas les données)
app.use("/login", authLimiter);
app.use("/reset-password", authLimiter);

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
const UserFollowersRouter = require("./routers/UserFollowersRouter");
const GroupChatRouter = require("./routers/GroupChatRouter");
const GroupParticipantsRouter = require("./routers/GroupParticipantsRouter");
const PostCommentLikesRouter = require("./routers/PostCommentLikesRouter");
const SurveycCommentLikesRouter = require("./routers/SurveycCommentLikesRouter");

// serve REACT APP — avant les routers pour que GET / serve index.html
const reactIndexFile = path.join(
  __dirname,
  "..",
  "..",
  "frontend",
  "dist",
  "index.html"
);

if (fs.existsSync(reactIndexFile)) {
  // Fichiers statiques (JS, CSS, images)
  app.use(express.static(path.join(__dirname, "..", "..", "frontend", "dist")));

  // Catch-all pour les routes React (navigation browser, pas les appels fetch/API)
  // Le header Accept du browser contient "text/html", fetch() envoie "*/*"
  app.get("*", (req, res, next) => {
    const accept = req.headers.accept || "";
    if (accept.includes("text/html")) {
      return res.sendFile(reactIndexFile);
    }
    next();
  });
}

app.use(express.static(path.join(__dirname, "../public")));

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
app.use(UserFollowersRouter);
app.use(GroupChatRouter);
app.use(GroupParticipantsRouter);
app.use(PostCommentLikesRouter);
app.use(SurveycCommentLikesRouter);

// ready to export

module.exports = app;
