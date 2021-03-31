const { validationResult } = require('express-validator');
const Training = require('../models/trainingModel')

// --------------------------------------------------------------------- >> GET
exports.get_all = async (req, res) => {
  try {
    const allTrainings = await Training.find({})
    res.json(allTrainings)
  } catch (e) {
    res.status(500).send(e.message)
  }
};

// ------------------------------------------------------------------ >> GET:ID
exports.get_by_id = async (req, res) => {
  const { id } = req.params

  try {
    const target = await Training.findById(id)
    if (!target) return res.status(404).send('Entry not found');
    res.json(target)
  } catch (e) {
    res.status(500).send(e.message)
  }
}

// -------------------------------------------------------------------- >> POST
exports.create = async (req, res) => {
  const { user, simulation, time_start, time_end, question_set } = req.body
  
  const errors = validationResult(req) 
  if(!errors.isEmpty()){ 
      return res.status(422).send({errors}) 
  }
  
  try {
      const created = await Training.create({ 
          user, simulation, time_start, time_end, question_set
      })
      res.json(created)
  } catch (e) {
  res.status(500).send(e.message)  }
};

// ------------------------------------------------------------------ >> PUT:ID
exports.update = async (req, res) => {
  const { id } = req.params
  const { user, simulation, time_start, time_end } = req.body

  const errors = validationResult(req); 
  if(!errors.isEmpty()){ 
      return res.status(422).send({errors}) 
  }

  let toUpdate = {};
  if (user) toUpdate.user = user;
  if (simulation) toUpdate.simulation = simulation;
  if (time_start) toUpdate.time_start = time_start;
  if (time_end) toUpdate.time_end = time_end;

  try {
    const updatedObj = await Training.findByIdAndUpdate(id, 
      toUpdate, {new: true}
    )
    res.send(updatedObj)
  } catch (e) {
    res.status(500).send(e.message);
  }
};


