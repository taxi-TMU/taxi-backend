const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt')
const User = require('../models/userModel')


// --------------------------------------------------------------------- >> GET
exports.get_all = async (req, res) => {
    try {
      const allUsers = await User.find({})
      res.json(allUsers)
    } catch (e) {
      res.status(500).send(e.message)
    }
}

// ------------------------------------------------------------------ >> GET:ID
exports.get_by_id = async (req, res) => {
    const { id } = req.params
    try {
      const targetUser = await User.findById(id)
      if (!targetUser) return res.status(404).send('Entry not found')
      res.json(targetUser)
    } catch (e) {
      res.status(500).send(e.message)
    }
}

// -------------------------------------------------------------------- >> POST
exports.create = async (req, res) => {
  const { first_name, last_name, email, password } = req.body

  const errors = validationResult(req) 
  if(!errors.isEmpty()){ 
      return res.status(422).send({errors}) 
  }

  try {
    const newUser = new User({ 
        first_name, last_name, email, password: await bcrypt.hash(password, 10) 
    })

    await newUser.save()

    const token = newUser.createToken()
    res.set('x-authorization-token', token).send(
      `${first_name} ${last_name}, ${email}: created successfully`
    )

  } catch (e) {
    res.status(500).send(e.message)
  }
}

// ------------------------------------------------------------------ >> PUT:ID
exports.update = async (req, res) => {
  const { id } = req.params
  const { first_name, last_name, active } = req.body

  const errors = validationResult(req); 
  if(!errors.isEmpty()){ 
      return res.status(422).send({errors}) 
  }

  let toUpdate = {};
  if (first_name) toUpdate.first_name = first_name;
  if (last_name) toUpdate.last_name = last_name;
  if (active) toUpdate.active = active;

  try {
    const updatedObj = await User.findByIdAndUpdate(id, 
      toUpdate, {new: true}
    )
    res.send(updatedObj)
  } catch (e) {
    res.status(500).send(e.message);
  }
};