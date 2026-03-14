const prisma = require("../lib/prisma");

const getUserFollowerss = async (_req, res) => {
  try {
    const followers = await prisma.userFollower.findMany();
    res.send(followers);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const getUserFollowersByID = async (req, res) => {
  try {
    const Following_ID = parseInt(req.params.id, 10);
    const followers = await prisma.userFollower.findMany({ where: { Following_ID } });
    if (followers.length === 0) return res.sendStatus(404);
    res.send(followers);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
  return null;
};

const createUserFollowers = async (req, res) => {
  try {
    const Follower_ID = parseInt(req.body.Follower_ID, 10);
    const Following_ID = parseInt(req.body.Following_ID, 10);
    await prisma.userFollower.create({ data: { Follower_ID, Following_ID } });
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const deleteUserFollowers = async (req, res) => {
  try {
    const Follower_ID = parseInt(req.body.Follower_ID, 10);
    const Following_ID = parseInt(req.body.Following_ID, 10);
    await prisma.userFollower.delete({
      where: { Follower_ID_Following_ID: { Follower_ID, Following_ID } },
    });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

module.exports = { getUserFollowerss, getUserFollowersByID, createUserFollowers, deleteUserFollowers };
