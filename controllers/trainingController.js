/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const Training = require('../models/trainingModel');

const checkIfTestPassed = (quiz) => {
  let rightones = 0;
  quiz.questions.forEach((question) => {
    if (question.userAnswer) rightones += 1;
  });
  if (rightones >= quiz.questions.length / 2) return true;
  return false;
};

const countPassed = (quizzes) => {
  let passed = 0;

  quizzes.forEach((quiz) => {
    let rightones = 0;
    quiz.questions.forEach((question) => {
      if (question.userAnswer) rightones += 1;
    });
    if (rightones >= quiz.questions.length / 2) passed += 1;
  });
  return passed;
};

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
    if (!training) {
      return res.status(404).send({
        msg: 'Entry not found',
        param: 'error',
      });
    }
    return res.json({
      _id: training._id,
      userId: training.userId,
      simulation: training.simulation,
      time_start: training.time_start,
      time_end: training.time_end,
      passed: await checkIfTestPassed(training),
      questions: training.questions,
    });
  } catch (e) {
    return res.status(500).send({
      msg: e.message,
      param: 'error',
    });
  }
};

// ------------------------------------------------------------- >> GET:USER:ID
exports.user_statistics = async (req, res) => {
  const { id } = req.params;

  try {
    const all_results = await Training.find({ userId: id });
    const trainings = [];
    const simulations = [];

    all_results.forEach((result) => {
      if (result.simulation) simulations.push(result);
      trainings.push(result);
    });

    return res.json({
      total: (simulations.length + trainings.length),
      simulations: {
        total_simulations: simulations.length,
        passed: await countPassed(simulations),
      },
      trainings: {
        total_trainings: trainings.length,
        passed: await countPassed(trainings),
      },
    });
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
    questions,
  } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors });
  }

  const toUpdate = {};
  toUpdate.questions = questions;

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
