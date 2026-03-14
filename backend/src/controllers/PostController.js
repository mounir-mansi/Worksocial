const prisma = require("../lib/prisma");
const { deleteS3Object } = require("../lib/deleteS3Object");

const getPosts = async (_req, res) => {
  try {
    const posts = await prisma.post.findMany({ orderBy: { Created_At: "desc" } });
    res.send(posts);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { Post_ID: parseInt(req.params.id, 10) },
    });
    if (!post) return res.sendStatus(404);
    res.send(post);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
  return null;
};

const createPost = async (req, res) => {
  try {
    const { Title, Content, Visibility } = req.body;
    const Image = req.file ? `${process.env.S3_PUBLIC_URL}/${req.file.key}` : null;
    const post = await prisma.post.create({
      data: { Title, Content, Visibility, Image, User_ID: req.User_ID },
    });
    res.location(`/posts/${post.Post_ID}`).sendStatus(201);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const updatePost = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { Title, Content, Visibility } = req.body;
    const data = { Title, Content, Visibility };
    if (req.file) {
      const old = await prisma.post.findUnique({ where: { Post_ID: id }, select: { Image: true } });
      if (old?.Image) await deleteS3Object(old.Image);
      data.Image = `${process.env.S3_PUBLIC_URL}/${req.file.key}`;
    }
    await prisma.post.update({ where: { Post_ID: id }, data });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const deletePost = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const post = await prisma.post.findUnique({ where: { Post_ID: id }, select: { Image: true } });
    await prisma.post.delete({ where: { Post_ID: id } });
    if (post?.Image) await deleteS3Object(post.Image);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

module.exports = { getPosts, getPostById, createPost, updatePost, deletePost };
