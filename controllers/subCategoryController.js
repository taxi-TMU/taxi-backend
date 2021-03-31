const { validationResult } = require('express-validator');
const SubCategory = require('../models/subCategoryModel')

// --------------------------------------------------------------------- >> GET
exports.get_all = async (req, res) => {
  try {
    const allSubCategories = await SubCategory.find({})
    res.json(allSubCategories)
  } catch (e) {
    res.status(500).send(e.message)
  }
}

// ------------------------------------------------------------------ >> GET:ID
exports.get_by_id = async (req, res) => {
  const { id } = req.params;

  try {
    const target = await SubCategory.findById(id)
    if (!target) return res.status(404).send('Entry not found')
    res.json(target)
  } catch (e) {
    res.status(500).send(e.message)
  }
}

// -------------------------------------------------------------------- >> POST
exports.create = async (req, res) => {
    const { name, category, questions } = req.body

    const errors = validationResult(req) 
    if(!errors.isEmpty()){ 
        return res.status(422).send({errors}) 
    }

    try {
        const created = await SubCategory.create({ 
          name, category, questions
        })
        res.json(created)
    } catch (e) {
        res.status(500).send(e.message)
    }
}


// ------------------------------------------------------------------ >> PUT:ID
exports.update = async (req, res) => {
  const { id } = req.params
  const { name, category } = req.body

  const errors = validationResult(req); 
  if(!errors.isEmpty()){ 
      return res.status(422).send({errors}) 
  }
  let toUpdate = {};
  if (name) toUpdate.name = name;
  if (category) toUpdate.category = category;

  try {
    const updatedObj = await SubCategory.findByIdAndUpdate(id, 
      toUpdate, {new: true}
    )
    res.send(updatedObj)
  } catch (e) {
    res.status(500).send(e.message);
  }
};





