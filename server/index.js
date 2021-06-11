const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const BUILD_URL = path.join(__dirname, '../client/build');

const app = express();
app.use(cookieParser(process.env.COOKIE_SECRET));

// Serve React App
app.use(express.static(BUILD_URL));
app.get('/', (_, res) => {
  return res.sendFile(path.join(BUILD_URL, 'index.html'));
});

// Routes
const authRouter = require('./routes/auth.js');
app.use('/auth', authRouter);
const userRouter = require('./routes/user.js');
app.use('/user', userRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
