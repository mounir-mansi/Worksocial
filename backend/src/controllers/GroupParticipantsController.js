const prisma = require("../lib/prisma");

const getAllParticipants = async (req, res) => {
  try {
    const GroupChat_ID = parseInt(req.params.groupChatId, 10);
    const participants = await prisma.groupParticipant.findMany({ where: { GroupChat_ID } });
    res.send(participants);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const addParticipant = async (req, res) => {
  try {
    const GroupChat_ID = parseInt(req.params.groupChatId, 10);
    const User_ID = parseInt(req.body.userId, 10);
    await prisma.groupParticipant.create({ data: { GroupChat_ID, User_ID } });
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const removeParticipant = async (req, res) => {
  try {
    const GroupChat_ID = parseInt(req.params.groupChatId, 10);
    const User_ID = parseInt(req.params.userId, 10);
    await prisma.groupParticipant.delete({
      where: { GroupChat_ID_User_ID: { GroupChat_ID, User_ID } },
    });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

module.exports = { getAllParticipants, addParticipant, removeParticipant };
