const { validationResult } = require('express-validator');
const Category = require('../models/categoryModel');


// --------------------------------------------------------------------- >> GET
exports.get_all = async (req, res) => {
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
    const target = await Category.findById(id);
    if (!target) return res.status(404).send('Entry not found');
    res.json(target);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

// -------------------------------------------------------------------- >> POST
exports.create = async (req, res) => {
  const { name, sub_categories } = req.body;

  const errors = validationResult(req) 
  if(!errors.isEmpty()){ 
      return res.status(422).send({errors}) 
  }

  try {
    const created = await Category.create({
      name, sub_categories
    });
    res.json(created)
  } catch (e) {
    res.status(500).send('Error while creating entry');
  }
};

// ------------------------------------------------------------------ >> PUT:ID
exports.update = async (req, res) => {
    const { id } = req.params
    const { name } = req.body

    const errors = validationResult(req); 
    if(!errors.isEmpty()){ 
        return res.status(422).send({errors}) 
    }

    try {
      const toUpdate = await Category.findOneAndUpdate(id,
        {name: name}, {new: true})
      res.send(toUpdate)
    } catch (e) {
      res.status(500).send(e.message);
    }
};



