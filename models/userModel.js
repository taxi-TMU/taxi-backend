const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')

const Schema = mongoose.Schema

const userSchema = new Schema({    
    first_name: { type: String, min: 2, max: 50, required: true },
    last_name: { type: String, min: 2, max: 50, required: true },
    email: { type: String, min: 2, max: 50, required: true, unique: true },
    password: { type: String, min: 2, max: 50, required: true },
    last_updated: { type: Date, default: Date.now },
    // active: { type: Boolean, default: false },
})

userSchema.methods.createToken = function () {
    const payload = { _id: this._id, email: this.email }
    const secretKey = process.env.JWT_SECRET;
    const token = jwt.sign(payload, secretKey)
    return token
}

const User = mongoose.model('User', userSchema)

module.exports = User;

// created: { type: Date, default: Date.now },