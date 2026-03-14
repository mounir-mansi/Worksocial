const prisma = require("../lib/prisma");
const { deleteS3Object } = require("../lib/deleteS3Object");

const getEvents = async (_req, res) => {
  try {
    const events = await prisma.event.findMany({ orderBy: { Created_At: "desc" } });
    res.send(events);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const getEventByID = async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { Event_ID: parseInt(req.params.id, 10) },
    });
    if (!event) return res.sendStatus(404);
    res.send(event);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
  return null;
};

const createEvent = async (req, res) => {
  try {
    const { EventName, StartDate, EndDate, StartTime, EndTime, Description, Visibility, ParticipantCount } = req.body;
    const Image = req.file ? `${process.env.S3_PUBLIC_URL}/${req.file.key}` : null;
    const event = await prisma.event.create({
      data: { EventName, StartDate, EndDate, StartTime, EndTime, Description, Visibility, ParticipantCount, Image, User_ID: req.User_ID },
    });
    res.location(`/events/${event.Event_ID}`).sendStatus(201);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const updateEvent = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { EventName, StartDate, EndDate, StartTime, EndTime, Description, Visibility, ParticipantCount } = req.body;
    const data = { EventName, StartDate, EndDate, StartTime, EndTime, Description, Visibility, ParticipantCount };
    if (req.file) {
      const old = await prisma.event.findUnique({ where: { Event_ID: id }, select: { Image: true } });
      if (old?.Image) await deleteS3Object(old.Image);
      data.Image = `${process.env.S3_PUBLIC_URL}/${req.file.key}`;
    }
    await prisma.event.update({ where: { Event_ID: id }, data });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const deleteEvent = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const event = await prisma.event.findUnique({ where: { Event_ID: id }, select: { Image: true } });
    await prisma.event.delete({ where: { Event_ID: id } });
    if (event?.Image) await deleteS3Object(event.Image);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

module.exports = { getEvents, getEventByID, createEvent, updateEvent, deleteEvent };
