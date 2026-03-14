const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
};

const hashPassword = async (req, res, next) => {
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
    if (!req.user || !req.user.hashedPassword) {
      console.error("Erreur: req.user non défini ou ne contient pas hashedPassword");
      return res.sendStatus(500);
    }
    const isVerified = await argon2.verify(req.user.hashedPassword, req.body.Password);
    if (isVerified) {
      const payload = { sub: req.user.User_ID };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "4h" });
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 4 * 60 * 60 * 1000,
      });
      // authToken aussi dans le body pour les clients mobiles (React Native)
      res.status(200).send({ user: req.user, authToken: token, message: "Login successful" });
    } else {
      res.status(401).send("Incorrect password");
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
  return null;
};

const verifyToken = async (req, res, next) => {
  try {
    // Cookie httpOnly (web) ou Authorization Bearer (mobile)
    const authHeader = req.headers?.authorization;
    const token =
      req.cookies?.token ||
      (authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null);

    if (!token) {
      return res.status(401).send("Vous n'avez pas d'autorisation de voir cette ressource");
    }

    const blacklisted = await prisma.blacklistedToken.findFirst({
      where: { jwtToken: token },
    });
    if (blacklisted) {
      return res.status(401).send("Session Expired. Please log in again.");
    }

    await new Promise((resolve, reject) => {
      // eslint-disable-next-line consistent-return
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          console.error("JWT verification error:", err);
          return reject(new Error("Unauthorized"));
        }
        req.User_ID = decoded.sub;
        resolve();
      });
    });

    next();
  } catch (err) {
    console.error(err);
    return res.sendStatus(401);
  }
  return null;
};

const blacklistToken = async (req, res) => {
  try {
    const token = req.cookies?.token;
    await prisma.blacklistedToken.create({ data: { jwtToken: token } });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
  return null;
};

module.exports = {
  hashPassword,
  verifyPassword,
  verifyToken,
  blacklistToken,
};
