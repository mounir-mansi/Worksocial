const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
// const cookie = require("cookie");

const models = require("../models");

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
};

const hashPassword = async (req, res, next) => {
  // hash the password using argon2 then call next()
  try {
    const hash = await argon2.hash(req.body.Password, hashingOptions);
    req.body.hashedPassword = hash;
    delete req.body.Password;
    next();
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const verifyPassword = async (req, res) => {
  try {
    const isVerified = await argon2.verify(
      req.user.hashedPassword,
      req.body.Password
    );
    if (isVerified) {
      const payload = { sub: req.user.User_ID };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "4h",
      });
      // res.cookie("token", token, {
      //   httpOnly: true,
      //   maxAge: 4 * 60 * 60 * 1000,
      // });
      console.info(req.user.Username);
      res.status(200).send({
        authToken: token,
        user: req.user,
        message: "Login successful",
      });
    } else {
      res.status(401).send("Incorrect password");
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res
        .status(401)
        .send("Vous n'avez pas d'authorisation de voir cette ressource");
    }
    // Check if the token starts with "Bearer "
    const isBearerToken = authHeader.startsWith("Bearer ");
    if (!isBearerToken) {
      res
        .status(401)
        .send({ message: "Authorisation Header is not of the type 'Bearer'" });
    }
    const token = authHeader.replace(/^Bearer\s+/, "");

    // Check for blacklisted tokens
    const [result] = await models.tokenBlacklist.findByToken(token);
    if (result.length > 0) {
      res.status(401).send("Session Expired. Please log in again.");
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("JWT verification error:", err);
        res.sendStatus(401);
      } else {
        // Token is valid, proceed with the next middleware
        req.User_ID = decoded.sub;
        next();
      }
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(401);
  }
};

const blacklistToken = async (req, res) => {
  const token = req.headers.authorization.replace(/^Bearer\s+/, "");
  await models.tokenBlacklist
    .insert(token)
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.sendStatus(404);
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

module.exports = {
  hashPassword,
  verifyPassword,
  verifyToken,
  blacklistToken,
};
