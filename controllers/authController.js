const bcrypt = require('bcrypt')
const crypto = require("crypto");
const { validationResult } = require('express-validator');
const clientURL = process.env.CLIENT_URL; // TODO change this 
const serverUrl = process.env.SERVER_URL;

const sendEmail = require("../utils/email/sendEmail");

const User = require('../models/userModel');
const Token = require("../models/tokenModel");
const Code = require("../models/codeModel");


// -------------------- SIGN UP --------------------------------------- >> POST
exports.signup = async (req, res, next) => {
    const { first_name, last_name, email, password } = req.body

    const errors = validationResult(req) 
    if(!errors.isEmpty()){ 
        return res.status(422).send({errors}) 
    }

    let userExists = await User.findOne({ email: email });
    if (userExists) throw new Error("Email already exist");
    
    const encryptedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({ 
        first_name, last_name, email, active: false,
        password: encryptedPassword 
    })

    const secretCode = await Code.create({
      secretCode: "dqwdxcxw3z", email
    })
    
    const token = user.createToken()
    // url: `${baseUrl}/api/auth/verification/verify-account/${user._id}/${secretCode}`
    const link = `${serverUrl}/emailConfirm/${secretCode.secretCode}/${user._id}`
    await sendEmail(
        user.email, 
        `Welcome to TMU! Please confirm your email`,
        { name: `${user.first_name} ${user.last_name} `, link: link },
        './template/welcome.handlebars')
    
    res.set('x-authorization-token', token).send(
        {
            userId: user._id,
            email: user.email,
            name: `${user.first_name} ${user.last_name} `,
            active: user.active,
            token: token,
            link: link,
            secretCode: secretCode
        }
    )
};


// -------------------- ACTIVATE / VERIFY USER ------------------------ >> POST
exports.emailConfirm = async (req, res, next) => {
  const { secretCode, userId } = req.params;

  const user = await User.findOne({ _id: userId });
  const code = await Code.findOne({ email: user.email });
  if ( code.secretCode !== secretCode ) {
    return res.status(400).send("Cannot verify account")
  }
  
  user.active = true
  res.redirect(clientURL)
}


// -------------------- LOGIN ----------------------------------------- >> POST
exports.login = async (req, res, next) => {
  const { email, password } = req.body

  let user = await User.findOne({ email })
  if (!user) return res.status(400).send('Invalid Credentials')

  const match = await bcrypt.compare(password, user.password)

  if (!match) return res.status(400).send(`No match! Invalid Credentials`)

  const token = user.createToken()

  const obj = {
      msg: 'User logged in successfully',
      token: token
  }

  res.set('x-authorization-token', token).send(obj)

}

// -------------------- PASSWORD RESET REQUEST------------------------- >> POST
exports.resetPasswordRequestController = async (req, res, next) => {
    const { email } = req.body

    const user = await User.findOne({ email });
    if (!user) throw new Error("User does not exist");

    let token = await Token.findOne({ userId: user._id });
    if (token) await token.deleteOne();
    let resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, 10);

    await Token.create({
        userId: user._id,
        token: hash,
        createdAt: Date.now(),
    })

    const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;
    sendEmail(user.email, 
        "Password Reset Request",
        {name: `${user.first_name} ${user.last_name} `, link: link,},
        "./template/requestResetPassword.handlebars");

    return res.json({
        userId: user._id,
        email: user.email,
        name: `${user.first_name} ${user.last_name} `,
        link: link
    });
};
  
// -------------------- RESET PASSWORD -------------------------------- >> POST
exports.resetPasswordController = async (req, res, next) => {
    const { userId, token, password} = req.body

    let passwordResetToken = await Token.findOne({ userId });
    if (!passwordResetToken) {
      throw new Error("Invalid or expired password reset token");
    }
    const isValid = await bcrypt.compare(token, passwordResetToken.token);
    if (!isValid) {
      throw new Error("Invalid or expired password reset token");
    }
    const hash = await bcrypt.hash(password, 10);
    await User.updateOne(
      { _id: userId },
      { $set: { password: hash } },
      { new: true }
    );
    const user = await User.findById({ _id: userId });
    sendEmail(
      user.email,
      "Password Reset Successfully",
      {
        name: `${user.first_name} ${user.last_name} `,
      },
      "./template/resetPassword.handlebars"
    );
    await passwordResetToken.deleteOne();

    return res.json({
        name: `${user.first_name} ${user.last_name} `,
        text: "Password succesfully updated"
    });
};
