const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const app = express();
app.use(cookieParser(process.env.COOKIE_SECRET));

const BADGES_URL = path.join(__dirname, 'badges');
app.use('/badges', express.static(BADGES_URL));

// Routes
const authRouter = require('./routes/auth.js');
app.use('/api/auth', authRouter);
const userRouter = require('./routes/user.js');
app.use('/api/user', userRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
