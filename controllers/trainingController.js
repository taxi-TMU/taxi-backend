/* eslint-disable camelcase */
const { validationResult } = require('express-validator');
const Training = require('../models/trainingModel');
const Question = require('../models/questionModel');

// --------------------------------------------------------------------- >> GET
exports.get_all = async (_req, res) => {
  try {
    const allTrainings = await Training.find({}).populate('questions');
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
    const target = await (await Training.findById(id)).populate('questions');
    if (!target) return res.status(404).send('Entry not found');
    return res.json(target);
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

  try {
    const created = await Training.create({
      userId,
      simulation,
      time_start,
      time_end,
      questions,
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
    userId, simulation, time_start, time_end,
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
