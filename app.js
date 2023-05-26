const express = require('express');
const app = express();

// files imports >>>>>>>>>>>>>>>
const connectDB = require('./db/connectDB.js');
const authRoutes = require('./routes/authRoutes.js');
const postRoutes = require('./routes/postRoutes.js');
// imports>>>>>>>>>>>>>>>>>>>
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();

// middlewares>>>>>>>>>>>>>>>>>>>>
// app.use((req, res, next) => {
//   res.setHeader(
//     'Access-Control-Allow-Origin',
//     'https://mern-blog-frontend-eosin.vercel.app'
//   );
//   res.setHeader('Access-Control-Allow-Methods', '*');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   res.setHeader('Content-Type', 'application/json, multipart/form-data');
//   next();
// });

var corsOptions = {
  origin: 'https://mern-blog-frontend-eosin.vercel.app',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  allowedHeaders: ['Content-Type,Authorization,multipart/form-data'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/posts', postRoutes);

// routes>>>>>>>>>>>>>>>
app.get('/', (req, res) => res.send('Welcome to Home page'));

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`app listening on port: ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
