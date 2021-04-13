const mongoose = require('mongoose');

const { Schema } = mongoose;

const { ObjectId } = mongoose.Schema.Types;

const trainingSchema = new Schema({
  userId: { type: ObjectId, ref: 'User', required: true },
  simulation: { type: Boolean, required: true },
  time_start: { type: Date },
  time_end: { type: Date },
  questions: Array, // [{ type: ObjectId, ref: 'Question' }],
});

const Training = mongoose.model('Training', trainingSchema);

module.exports = Training;
