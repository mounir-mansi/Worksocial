const prisma = require("../lib/prisma");

const resourceMap = {
  surveys: (id) => prisma.survey.findUnique({ where: { Survey_ID: id } }),
  events: (id) => prisma.event.findUnique({ where: { Event_ID: id } }),
  posts: (id) => prisma.post.findUnique({ where: { Post_ID: id } }),
  users: (id) => prisma.user.findUnique({ where: { User_ID: id } }),
  "event-comments": (id) => prisma.eventComment.findUnique({ where: { Comment_ID: id } }),
  "survey-comments": (id) => prisma.surveyComment.findUnique({ where: { Comment_ID: id } }),
  "post-comments": (id) => prisma.postComment.findUnique({ where: { Comment_ID: id } }),
};

const verifyOwner = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const primaryResource = req.url.split("/")[1];

    let resourceKey;
    if (req.url.includes("comments")) {
      resourceKey = `${primaryResource}-comments`;
    } else {
      resourceKey = primaryResource;
    }

    const finder = resourceMap[resourceKey];
    if (!finder) {
      return res.status(400).send({ message: "Invalid resource type" });
    }

    const resource = await finder(id);
    if (!resource) return res.sendStatus(404);

    if (resource.User_ID === req.User_ID) {
      next();
    } else {
      res.status(403).send(`You are not the owner of this resource`);
    }
  } catch (err) {
    console.error("Erreur dans verifyOwner :", err);
    res.sendStatus(500);
  }
  return null;
};

module.exports = verifyOwner;
