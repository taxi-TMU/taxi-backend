/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const clientURL = process.env.CLIENT_URL;
const serverUrl = process.env.SERVER_PROD_URL; // TODO change this

const sendEmail = require('../utils/email/sendEmail');

const User = require('../models/userModel');
const Token = require('../models/tokenModel');
const Code = require('../models/codeModel');

// -------------------- SIGN UP --------------------------------------- >> POST
exports.signup = async (req, res) => {
  const {
    first_name, last_name, email, password,
  } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors });
  }

  const userExists = await User.findOne({ email });
  if (userExists) throw new Error('Email already exist');

  const encryptedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    first_name,
    last_name,
    email,
    active: false,
    password: encryptedPassword,
  });

  const secretCode = await Code.create({
    secretCode: await bcrypt.hash(uuidv4().toString(), 10),
    email,
  });

  const token = user.createToken();
  const link = `${serverUrl}/emailConfirm/${secretCode.secretCode}/${user._id}`;
  await sendEmail(
    user.email,
    'Welcome to TMU! Please confirm your email',
    { name: `${user.first_name} ${user.last_name} `, link },
    './template/welcome.handlebars',
  );

  return res.set('x-authorization-token', token).send({
    userId: user._id,
    email: user.email,
    name: `${user.first_name} ${user.last_name} `,
    active: user.active,
    token,
    link,
    secretCode,
  });
};

// -------------------- ACTIVATE / VERIFY USER ------------------------ >> POST
exports.emailConfirm = async (req, res) => {
  const { secretCode, userId } = req.params;

  const user = await User.findOne({ _id: userId });
  const code = await Code.findOne({ email: user.email });
  if (code.secretCode !== secretCode) {
    return res.status(400).send('Cannot verify account');
  }
  if (user.active) return res.json('already active');

  user.active = true;
  await user.save();
  return res.redirect(clientURL);
};

// -------------------- LOGIN ----------------------------------------- >> POST
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).send('Invalid Credentials');

  const match = await bcrypt.compare(password, user.password);

  if (!match) return res.status(400).send('Invalid Credentials');

  const token = user.createToken();

  const obj = {
    msg: 'User logged in successfully',
    token,
    userId: user._id,
  };

  res.set('x-authorization-token', token).send(obj);
};

// -------------------- PASSWORD REQUEST ------------------------ >> POST
exports.resetPasswordRequest = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new Error('User does not exist');

  const token = await Token.findOne({ userId: user._id });
  if (token) await token.deleteOne();
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hash = await bcrypt.hash(resetToken, 10);

  await Token.create({
    userId: user._id,
    token: hash,
    createdAt: Date.now(),
  });

  const url = `${clientURL}/reset/password/${user._id}/${resetToken}`;
  sendEmail(
    user.email,
    'Password Reset Request',
    {
      name: `${user.first_name} ${user.last_name} `,
      link: url,
      email: user.email,
    },
    './template/requestResetPassword.handlebars',
  );

  return res.json({
    userId: user._id,
    email: user.email,
    name: `${user.first_name} ${user.last_name} `,
    link: url,
  });
};

// -------------------- RESET PASSWORD -------------------------------- >> POST
exports.resetPassword = async (req, res) => {
  const { userId, token, password } = req.body;

  const passwordResetToken = await Token.findOne({ userId });
  if (!passwordResetToken) {
    throw new Error('Invalid or expired password reset token');
  }
  const isValid = await bcrypt.compare(token, passwordResetToken.token);
  if (!isValid) {
    throw new Error('Invalid or expired password reset token');
  }
  const hash = await bcrypt.hash(password, 10);
  await User.updateOne(
    { _id: userId },
    { $set: { password: hash } },
    { new: true },
  );
  const user = await User.findById({ _id: userId });
  sendEmail(
    user.email,
    'Password succesfully updated',
    {
      name: `${user.first_name} ${user.last_name} `,
    },
    './template/resetPassword.handlebars',
  );
  await passwordResetToken.deleteOne();

  return res.json({
    name: `${user.first_name} ${user.last_name} `,
    text: 'Password succesfully updated',
  });
};
