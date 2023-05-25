const Post = require('../models/Post.js');
const mongoose = require('mongoose');
const checkPermission = require('../utils/checkPermission.js');

const createPost = async (req, res) => {
  const { title, summary, content, cover } = req.body;
  try {
    // const newPost = new Post(req.body)

    // const post = await newPost.save()

    const newPost = await Post.create({
      title,
      summary,
      content,
      cover,
      createdBy: req.user.userId,
    });

    res
      .status(201)
      .json({ message: 'Post created successfully', post: newPost });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const allPosts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate('createdBy', 'username');
    res.status(200).json({
      allPosts,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getSinglePost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await Post.findOne({
      _id: new mongoose.Types.ObjectId(id),
    }).populate('createdBy', 'username');

    if (!post) {
      return res.status(404).json({ message: `Post with ${id} not found` });
    }
    res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const editPost = async (req, res) => {
  const { title, summary, content, cover } = req.body;
  const { id } = req.params;
  try {
    const post = await Post.findOne({ _id: id });
    if (!post) {
      return res.status(404).json({ message: `Post with id: ${id} not found` });
    }
    checkPermission(req.user, post.createdBy, res);

    post.title = title;
    post.content = content;
    post.summary = summary;
    post.cover = cover;

    await post.save();
    res.status(200).json({ message: 'Post edited successfully', post });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
module.exports = { createPost, getAllPosts, getSinglePost, editPost };
