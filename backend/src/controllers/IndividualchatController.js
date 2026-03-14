const prisma = require("../lib/prisma");

const browse = async (_req, res) => {
  try {
    const chats = await prisma.individualChat.findMany();
    res.send(chats);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const getAllChatsForUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const chats = await prisma.individualChat.findMany({
      where: { OR: [{ User_ID1: userId }, { User_ID2: userId }] },
    });
    res.send(chats);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const getIndividualchat = async (req, res) => {
  try {
    const chat = await prisma.individualChat.findUnique({
      where: { Chat_ID: parseInt(req.params.individualchatID, 10) },
    });
    if (!chat) return res.sendStatus(404);
    res.send(chat);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
  return null;
};

const createIndividualchat = async (req, res) => {
  try {
    const { Content } = req.body;
    const User_ID1 = parseInt(req.body.User_ID1, 10);
    const User_ID2 = parseInt(req.body.User_ID2, 10);
    const chat = await prisma.individualChat.create({ data: { Content, User_ID1, User_ID2 } });
    res.status(201).json({ chatId: chat.Chat_ID });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const deleteIndividualchat = async (req, res) => {
  try {
    await prisma.individualChat.delete({
      where: { Chat_ID: parseInt(req.params.individualchatID, 10) },
    });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const update = async (req, res) => {
  try {
    const id = parseInt(req.params.individualchatID, 10);
    const { Content } = req.body;
    await prisma.individualChat.update({ where: { Chat_ID: id }, data: { Content } });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

module.exports = { browse, getAllChatsForUser, getIndividualchat, createIndividualchat, deleteIndividualchat, update };
