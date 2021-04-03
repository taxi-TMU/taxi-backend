const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema

const userSchema = new Schema({    
    first_name: { type: String, min: 2, max: 50, trim: true, required: true },
    last_name: { type: String, min: 2, max: 50, trim: true, required: true },
    email: { type: String, min: 2, max: 50, trim: true, required: true, unique: true },
    password: { type: String, min: 2, max: 50, required: true },
    active: { type: Boolean, default: false },
    }, { timestamps: true,
  })

userSchema.methods.createToken = function () {
    const payload = { _id: this._id, email: this.email }
    const secretKey = process.env.JWT_SECRET;
    const token = jwt.sign(payload, secretKey)
    return token
}

// TODO MOTHERFUCKING ASSHOLE DONT FORGET TO FIX THIS
//     userSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) {
//       return next();
//     }
//     const hash = await bcrypt.hash(this.password, 10);
//     this.password = hash;
//     next();
//   });


const User = mongoose.model('User', userSchema)

module.exports = User;
