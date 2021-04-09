require('express-async-errors');
require('dotenv').config();
require('./db/client');

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();
const cors = require('cors');

const userRouter = require('./routes/userRouter');
const authRouter = require('./routes/authRouter');
const questionRouter = require('./routes/questionRouter');
const categoryRouter = require('./routes/categoryRouter');
const subCategoryRouter = require('./routes/subCategoryRouter');
const trainingRouter = require('./routes/trainingRouter');

app.use(cors({ exposedHeaders: 'x-authorization-token' }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/question', questionRouter);
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/subcategory', subCategoryRouter);
app.use('/api/v1/training', trainingRouter);

module.exports = app;
