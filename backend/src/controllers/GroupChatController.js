const prisma = require("../lib/prisma");

const getAllGroupChats = async (_req, res) => {
  try {
    const chats = await prisma.groupChat.findMany();
    res.send(chats);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const getGroupChatById = async (req, res) => {
  try {
    const chat = await prisma.groupChat.findUnique({
      where: { GroupChat_ID: parseInt(req.params.groupChatId, 10) },
    });
    if (!chat) return res.sendStatus(404);
    res.send(chat);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
  return null;
};

const createGroupChat = async (req, res) => {
  try {
    const { GroupName, Content } = req.body;
    const User_ID = parseInt(req.body.User_ID, 10);
    const chat = await prisma.groupChat.create({ data: { GroupName, Content, User_ID } });
    res.location(`/groupchats/${chat.GroupChat_ID}`).sendStatus(201);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const deleteGroupChat = async (req, res) => {
  try {
    await prisma.groupChat.delete({
      where: { GroupChat_ID: parseInt(req.params.groupChatId, 10) },
    });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

module.exports = { getAllGroupChats, getGroupChatById, createGroupChat, deleteGroupChat };
