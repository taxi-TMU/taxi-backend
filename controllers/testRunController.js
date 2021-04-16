/* eslint-disable no-underscore-dangle */
const Question = require('../models/questionModel');
const SubCategory = require('../models/subCategoryModel');

// --------------------------------------------------------------------- >> GET
exports.testrun = async (_req, res) => {
  try {
    const result = await SubCategory.find({});
    const subcat = result[0];
    const questions = await Question.find({ sub_category: subcat._id }).limit(4);

    const updatedQuestions = [];
    await questions.forEach((question) => {
      const newAnswers = [];
      question.answers.forEach((answer) => {
        newAnswers.push({
          _id: answer._id,
          text: answer.text,
          checked: answer.checked,
          userAnswer: false,
        });
      });

      updatedQuestions.push({
        question_text: question.question_text,
        answers: newAnswers,
      });
    });

    return res.json({
      time_start: Date.now(),
      time_end: null,
      questions: updatedQuestions,
    });
  } catch (e) {
    return res.status(500).send({
      msg: e.message,
      param: 'error',
    });
  }
};
