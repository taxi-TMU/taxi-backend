/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const Training = require('../models/trainingModel');

// --------------------------------------------------------------------- >> GET
exports.get_all = async (_req, res) => {
  try {
    const allTrainings = await Training.find({});
    return res.json(allTrainings);
  } catch (e) {
    return res.status(500).send({
      msg: e.message,
      param: 'error',
    });
  }
};

// ------------------------------------------------------------------ >> GET:ID
exports.get_by_id = async (req, res) => {
  const { id } = req.params;

  try {
    const training = await Training.findById(id);
    if (!training) return res.status(404).send('Entry not found');
    return res.json(training);
  } catch (e) {
    return res.status(500).send({
      msg: e.message,
      param: 'error',
    });
  }
};

// -------------------------------------------------------------------- >> POST
exports.create = async (req, res) => {
  const {
    userId, questions, simulation, time_start, time_end,
  } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors });
  }

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
      _id: uuidv4(),
      original_id: question._id,
      question_text: question.question_text,
      sub_category: question.sub_category,
      answers: newAnswers,
    });
  });

  try {
    const created = await Training.create({
      userId,
      simulation,
      time_start,
      time_end,
      questions: updatedQuestions,
    });

    return res.json(created);
  } catch (e) {
    return res.status(500).send({
      msg: e.message,
      param: 'error',
    });
  }
};

// ------------------------------------------------------------------ >> PUT:ID
exports.update = async (req, res) => {
  const { id } = req.params;
  const {
    userId, simulation, time_start, time_end, questions,
  } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors });
  }

  const toUpdate = {};
  if (userId) toUpdate.userId = userId;
  if (simulation) toUpdate.simulation = simulation;
  if (time_start) toUpdate.time_start = time_start;
  if (time_end) toUpdate.time_end = time_end;
  if (questions) toUpdate.questions = questions;

  try {
    const updatedObj = await Training.findByIdAndUpdate(id, toUpdate, {
      new: true,
    });
    return res.json(updatedObj);
  } catch (e) {
    return res.status(500).send({
      msg: e.message,
      param: 'error',
    });
  }
};
