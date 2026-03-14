const prisma = require("../lib/prisma");

const getLikesByEventId = async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId, 10);
    const likes = await prisma.eventLike.findMany({ where: { Event_ID: eventId } });
    res.send(likes);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const likeEvent = async (req, res) => {
  try {
    const Event_ID = parseInt(req.params.eventId, 10);
    const User_ID = parseInt(req.body.userId, 10);
    await prisma.eventLike.create({ data: { Event_ID, User_ID } });
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const unlikeEvent = async (req, res) => {
  try {
    const Event_ID = parseInt(req.params.eventId, 10);
    const User_ID = parseInt(req.body.userId, 10);
    await prisma.eventLike.delete({ where: { Event_ID_User_ID: { Event_ID, User_ID } } });
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

module.exports = { getLikesByEventId, likeEvent, unlikeEvent };
