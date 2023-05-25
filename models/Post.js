const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
    },
    summary: {
      type: String,
      required: [true, 'Please provide summary'],
    },
    content: {
      type: String,
    },
    cover: {
      type: String,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'user',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('post', PostSchema);
