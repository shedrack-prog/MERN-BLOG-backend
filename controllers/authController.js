const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  const { username, email, password } = req.body;
  const oneDay = 1000 * 60 * 60 * 24;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all values' });
    }

    const userAlreadyExist = await User.findOne({ username });

    if (userAlreadyExist) {
      return res
        .status(400)
        .json({ message: 'Username already in use. Please try another!' });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(Date.now() + oneDay),
    });
    res.status(201).json({
      username,
      userId: newUser._id,
      message: 'Account created successfully',
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Login controller
const login = async (req, res) => {
  const { username, password } = req.body;
  const oneDay = 1000 * 60 * 60 * 24;

  try {
    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide all values' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(404)
        .json({ message: 'No account found with details provided' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRATION,
      }
    );
    res.cookie('token', token);

    // , {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   expires: new Date(Date.now() + oneDay),
    // });
    user.password = undefined;
    res.status(200).json({ token, message: 'Login successful', user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  const userId = req.user.userId;

  try {
    const user = await User.findOne({ _id: userId });
    user.password = undefined;
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'No Authentication' });
  }

  //   const { token } = req.cookies;
  //   jwt.verify(token, process.env.JWT_SECRET, {}, (err, info) => {
  //     if (err) throw err;
  //     res.json(info);
  //   });
};

const logoutUser = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,

    expires: new Date(Date.now() + 1000),
  });

  res.status(200).json({ message: 'User logged out' });
};

module.exports = { login, register, getProfile, logoutUser };
