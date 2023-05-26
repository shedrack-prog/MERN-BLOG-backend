const cloudinary = require('cloudinary');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImages = async (req, res) => {
  try {
    const { path } = req.body;
    let files = Object.values(req.files).flat();
    let images = [];
    for (const file of files) {
      const url = await uploadToCloudinary(file, path);
      images.push(url);

      removeTmp(file.tempFilePath);
    }
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const listImages = async (req, res) => {
  const { path, sort, max } = req.body;

  cloudinary.v2.search
    .expression(`${path}`)
    .sort_by('created_at', `${sort}`)
    .max_results(max)
    .execute()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err.error.message);
    });
};

const uploadToCloudinary = async (file, path) => {
  return new Promise((resolve) => {
    cloudinary.v2.uploader.upload(
      file.tempFilePath,
      { folder: path },
      (err, res) => {
        if (err) {
          removeTmp(file.tempFilePath);
          return res.json({ message: err });
        }
        resolve({
          url: res.secure_url,
        });
      }
    );
  });
};

module.exports = { uploadImages, listImages };
const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};
