const express = require('express');
const { uploadImages } = require('../controllers/uploadsController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');
const imgMiddleware = require('../middlewares/imgMiddleware.js');
const {
  createPost,
  getAllPosts,
  getSinglePost,
  editPost,
} = require('../controllers/postController.js');

const router = express.Router();

router.route('/create').post(authMiddleware, createPost);
router.route('/getAllPosts').get(getAllPosts);
router.route('/uploadImage').post(authMiddleware, imgMiddleware, uploadImages);
router.route('/:id').get(getSinglePost);
router.route('/:id').post(authMiddleware, editPost);

module.exports = router;
