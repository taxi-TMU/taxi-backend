/* eslint-disable camelcase */
const { validationResult } = require('express-validator');
const Question = require('../models/questionModel');

// --------------------------------------------------------------------- >> GET
exports.get_all = async (_req, res) => {
  try {
    const allQuestions = await Question.find({});
    res.json(allQuestions);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

// ------------------------------------------------------------------ >> GET:ID
exports.get_by_id = async (req, res) => {
  const { id } = req.params;

  try {
    const target = await Question.findById(id);
    if (!target) return res.status(404).send('Entry not found');
    return res.json(target);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

// -------------------------------------------------------------------- >> POST
exports.create = async (req, res) => {
  const {
    language, question_text, sub_category, answers,
  } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors });
  }

  try {
    const created = await Question.create({
      language,
      question_text,
      sub_category,
      answers,
    });
    return res.json(created);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

// ------------------------------------------------------------------ >> PUT:ID
exports.update = async (req, res) => {
  const { id } = req.params;
  const {
    language, question_text, sub_category, answers,
  } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors });
  }

  const toUpdate = {};
  if (language) toUpdate.language = language;
  if (question_text) toUpdate.question_text = question_text;
  if (sub_category) toUpdate.sub_category = sub_category;
  if (answers) toUpdate.answers = answers;

  try {
    const updatedObj = await Question.findByIdAndUpdate(id, toUpdate, {
      new: true,
    });
    return res.send(updatedObj);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

// ------------------------------------------------------------------ >> DELETE ALL

exports.delete_all = async (req, res) => {
  try {
    const deleted = await Question.deleteMany({});
    return res.json(deleted);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};