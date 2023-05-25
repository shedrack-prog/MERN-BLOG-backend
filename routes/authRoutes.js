const express = require('express');

const router = express.Router();

const {
  login,
  register,
  getProfile,
  logoutUser,
} = require('../controllers/authController.js');
const authMiddleWare = require('../middlewares/authMiddleware.js');

router.route('/login').post(login);
router.route('/register').post(register);
router.route('/logout').post(logoutUser);
router.route('/getProfile').post(authMiddleWare, getProfile);

module.exports = router;
