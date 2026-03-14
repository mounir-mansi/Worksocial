const prisma = require("../lib/prisma");

const addUserToCompany = async (req, res) => {
  try {
    const Company_ID = parseInt(req.body.Company_ID, 10);
    const User_ID = parseInt(req.body.User_ID, 10);
    const { Role } = req.body;
    await prisma.companyUser.create({ data: { Company_ID, User_ID, Role } });
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const getUsersInCompany = async (req, res) => {
  try {
    const Company_ID = parseInt(req.params.companyID, 10);
    const users = await prisma.companyUser.findMany({
      where: { Company_ID },
      include: { user: true },
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const updateUserRoleInCompany = async (req, res) => {
  try {
    const Company_ID = parseInt(req.params.companyID, 10);
    const User_ID = parseInt(req.params.UserID, 10);
    const { Role } = req.body;
    await prisma.companyUser.update({
      where: { Company_ID_User_ID: { Company_ID, User_ID } },
      data: { Role },
    });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const removeUserFromCompany = async (req, res) => {
  try {
    const Company_ID = parseInt(req.params.companyID, 10);
    const User_ID = parseInt(req.params.UserID, 10);
    await prisma.companyUser.delete({
      where: { Company_ID_User_ID: { Company_ID, User_ID } },
    });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

module.exports = { addUserToCompany, getUsersInCompany, updateUserRoleInCompany, removeUserFromCompany };
