const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const questionSchema = new Schema({
  language: {
    type: String, min: 2, max: 2, required: true,
  },
  question_text: {
    type: String, min: 2, max: 500, required: true,
  },
  sub_category: { type: ObjectId, ref: 'SubCategory', required: true },
  answers: Array, // TODO subschema?
  trainings: [{ type: ObjectId, ref: 'Training', required: true }],
});


const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
