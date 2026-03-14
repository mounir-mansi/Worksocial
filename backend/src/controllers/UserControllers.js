const crypto = require("crypto");
const { sendEmail } = require("../lib/emailSender");
const { generateVerificationCode } = require("../../utils/helperFunctions");
const prisma = require("../lib/prisma");
const { deleteS3Object } = require("../lib/deleteS3Object");

const login = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { Email: req.body.Email },
    });
    if (!user) {
      return res.status(401).json({ emailNotFound: true });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving data from database");
  }
  return null;
};

const getUsers = async (_req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.send(users);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const getUserByID = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { User_ID: parseInt(req.params.id, 10) },
    });
    if (!user) return res.sendStatus(404);
    res.send(user);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
  return null;
};

const updateUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { Username, LastName, FirstName, BirthDate, Age, Address, Email, Phone, Biography, Role, Gender } = req.body;
    let { ProfileImage } = req.body;
    if (req.file) {
      const old = await prisma.user.findUnique({ where: { User_ID: id }, select: { ProfileImage: true } });
      if (old?.ProfileImage) await deleteS3Object(old.ProfileImage);
      ProfileImage = `${process.env.S3_PUBLIC_URL}/${req.file.key}`;
    }
    const parsedAge = Age ? parseInt(Age, 10) : undefined;
    await prisma.user.update({
      where: { User_ID: id },
      data: {
        Username: Username || undefined,
        LastName: LastName || undefined,
        FirstName: FirstName || undefined,
        BirthDate: BirthDate ? new Date(BirthDate) : undefined,
        Age: parsedAge && !Number.isNaN(parsedAge) ? parsedAge : undefined,
        Address: Address || undefined,
        Email: Email || undefined,
        Phone: Phone || undefined,
        Biography: Biography || undefined,
        Role: Role || undefined,
        Gender: Gender || undefined,
        ProfileImage,
      },
    });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const updatePassword = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.user.update({
      where: { User_ID: id },
      data: { hashedPassword: req.body.hashedPassword },
    });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const createUser = async (req, res) => {
  try {
    const user = req.body;
    if (req.file) {
      user.ProfileImage = `${process.env.S3_PUBLIC_URL}/${req.file.key}`;
    }
    const created = await prisma.user.create({
      data: {
        Username: user.Username,
        LastName: user.LastName,
        FirstName: user.FirstName,
        BirthDate: user.BirthDate ? new Date(user.BirthDate) : null,
        Age: user.Age ? parseInt(user.Age, 10) : null,
        Address: user.Address || null,
        Email: user.Email,
        Phone: user.Phone || null,
        Biography: user.Biography || null,
        hashedPassword: user.hashedPassword,
        Role: user.Role || "User",
        Gender: user.Gender,
        ProfileImage: user.ProfileImage || null,
        Company_ID: user.Company_ID ? parseInt(user.Company_ID, 10) : null,
      },
    });
    res.location(`/users/${created.User_ID}`).sendStatus(201);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const deleteUser = async (req, res) => {
  try {
    const emailInput = req.body.Email;
    const user = await prisma.user.findUnique({
      where: { User_ID: parseInt(req.params.id, 10) },
    });
    if (!user) return res.sendStatus(404);
    if (emailInput !== user.Email) return res.sendStatus(403);
    await prisma.user.delete({ where: { Email: emailInput } });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
  return null;
};

const logout = (req, res, next) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  next();
};

const getUserByEmail = async (req, res) => {
  const { Email } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { Email } });
    if (!user) return res.status(404).send("User not found");
    const uniqueKey = crypto.randomBytes(32).toString("hex");
    await prisma.resetPasswordKey.create({ data: { unique_key: uniqueKey, Email } });
    res.status(200).send({ uniqueKey, Email });
    await sendEmail({
      to: Email,
      subject: "Re-initialiser votre Mot de Passe",
      text: `Bonjour, cliquez ici pour réinitialiser votre mot de passe : ${process.env.FRONTEND_URL}/resetpassword/${uniqueKey}`,
      html: `Bonjour, cliquez ici pour réinitialiser votre mot de passe : ${process.env.FRONTEND_URL}/resetpassword/${uniqueKey}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving data from database");
  }
  return null;
};

const verifyKey = async (req, res) => {
  try {
    const { key } = req.body;
    const record = await prisma.resetPasswordKey.findUnique({ where: { unique_key: key } });
    if (!record) return res.status(404).send("Key not found");
    if (new Date() > new Date(record.expires_at)) {
      return res.status(400).send(true);
    }
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
  return null;
};

const resetPassword = async (req, res) => {
  try {
    const { hashedPassword, key } = req.body;
    if (!key) return res.sendStatus(400);
    const record = await prisma.resetPasswordKey.findUnique({ where: { unique_key: key } });
    if (!record) return res.sendStatus(404);
    await prisma.user.update({
      where: { Email: record.Email },
      data: { hashedPassword },
    });
    await prisma.resetPasswordKey.delete({ where: { unique_key: key } });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
  return null;
};

const getUserByEmailWithPasswordAndPassToNext = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { Email: req.body.Email } });
    if (!user) return res.sendStatus(401);
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving data from database");
  }
  return null;
};

const verifyUsernameAvailability = async (req, res) => {
  try {
    const existing = await prisma.user.findUnique({ where: { Username: req.query.username } });
    res.json({ isAvailable: !existing });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur interne du serveur");
  }
};

const verifyEmailAvailability = async (req, res) => {
  try {
    const existing = await prisma.user.findUnique({ where: { Email: req.query.email } });
    res.json({ isAvailable: !existing });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur interne du serveur");
  }
};

const verifyPhoneAvailability = async (req, res) => {
  try {
    const existing = await prisma.user.findFirst({ where: { Phone: req.query.phone } });
    res.json({ isAvailable: !existing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

const requestEmailVerification = async (req, res) => {
  const { userId, email } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { User_ID: parseInt(userId, 10) } });
    if (!user) return res.status(404).send({ message: "User not found" });

    const code = generateVerificationCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    await prisma.emailVerification.create({
      data: { User_ID: parseInt(userId, 10), verification_code: code, expires_at: expiresAt },
    });

    const emailSent = await sendEmail({
      to: email,
      subject: "Code de vérification",
      text: `Votre code de vérification : ${code}. Valable 15 minutes.`,
      html: `<b>Votre code de vérification : ${code}. Valable 15 minutes.</b>`,
    });

    if (emailSent) {
      res.status(200).send({ message: "Verification code sent to email." });
    } else {
      throw new Error("Failed to send verification email.");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error requesting email verification" });
  }
  return null;
};

const verifyEmailCode = async (req, res) => {
  const { userId, code } = req.body;
  try {
    const record = await prisma.emailVerification.findFirst({
      where: {
        User_ID: parseInt(userId, 10),
        verification_code: code,
        expires_at: { gt: new Date() },
      },
    });
    if (!record) {
      return res.status(400).send({ message: "Invalid or expired verification code." });
    }
    await prisma.user.update({
      where: { User_ID: parseInt(userId, 10) },
      data: { emailVerified: true },
    });
    await prisma.emailVerification.deleteMany({
      where: { User_ID: parseInt(userId, 10), verification_code: code },
    });
    res.status(200).send({ message: "Email verified successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error verifying email code." });
  }
  return null;
};

module.exports = {
  getUsers,
  getUserByID,
  updateUser,
  createUser,
  deleteUser,
  login,
  logout,
  getUserByEmailWithPasswordAndPassToNext,
  updatePassword,
  verifyUsernameAvailability,
  verifyEmailAvailability,
  verifyPhoneAvailability,
  requestEmailVerification,
  verifyEmailCode,
  getUserByEmail,
  resetPassword,
  verifyKey,
};
