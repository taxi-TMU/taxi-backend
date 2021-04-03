const mongoose = require('mongoose');

const Schema = mongoose.Schema

const codeSchema = new Schema({
    email: { type: String, required: true, },
    secretCode: { type: String, required: true, },
    dateCreated: { type: Date, default: Date.now(),  expires: 600, }, // 10min
});

const Code = mongoose.model('Code', codeSchema)

module.exports = Code;



