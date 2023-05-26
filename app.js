const express = require('express');
const app = express();

// files imports >>>>>>>>>>>>>>>
const connectDB = require('./db/connectDB.js');
const authRoutes = require('./routes/authRoutes.js');
const postRoutes = require('./routes/postRoutes.js');
// imports packages >>>>>>>>>>>>>>>>>>>
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
dotenv.config();

// middlewares>>>>>>>>>>>>>>>>>>>>
// app.use((req, res, next) => {
//   res.setHeader(
//     'Access-Control-Allow-Origin',
//     'https://mern-blog-frontend-eosin.vercel.app'
//   );
//   res.setHeader(
//     'Access-Control-Allow-Methods',
//     'GET,HEAD,PUT,PATCH,POST,DELETE'
//   );
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'Content-Type, Authorization, application/json, text/plain'
//   );
//   res.setHeader(
//     'Content-Type',
//     'application/json, multipart/form-data application/x-www-form-urlencoded, multipart/form-data,text/plain'
//   );
//   next();
// });

const corsOptions = {
  origin: 'https://mern-blog-frontend-eosin.vercel.app',
  optionsSuccessStatus: 200,
  allowedHeaders: [
    'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Access-Control-Allow-Origin, Authorization',
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

// app.use(function (req, res, next) {
//   res.header(
//     'Access-Control-Allow-Origin',
//     'https://mern-blog-frontend-eosin.vercel.app'
//   );
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept, Cache-Control, Key, Access-Control-Allow-Origin'
//   );
//   next();
// });

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
app.use(cookieParser());
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
