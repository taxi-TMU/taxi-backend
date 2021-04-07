/* eslint-disable camelcase */
const { validationResult } = require('express-validator');
const Category = require('../models/categoryModel');

// --------------------------------------------------------------------- >> GET
exports.get_all = async (_req, res) => {
  try {
    const allCategories = await Category.find({});
    res.json(allCategories);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

// ------------------------------------------------------------------ >> GET:ID
exports.get_by_id = async (req, res) => {
  const { id } = req.params;

  try {
    const target = await Category.findById(id)// .populate('sub_categories');
    if (!target) return res.status(404).send('Entry not found');
    return res.json(target);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

// -------------------------------------------------------------------- >> POST
exports.create = async (req, res) => {
  const { name, sub_categories } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors });
  }

  try {
    const created = await Category.create({
      name,
      sub_categories,
    });
    return res.json(created);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

// ------------------------------------------------------------------ >> PUT:ID
exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, sub_categories } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors });
  }

  const toUpdate = {};
  if (name) toUpdate.name = name;
  if (sub_categories) toUpdate.sub_categories = sub_categories;

  try {
    const updatedObj = await Category.findByIdAndUpdate(id, toUpdate, {
      new: true,
    });
    return res.send(updatedObj);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};
