const User = require('../models/userModel')
const bcrypt = require('bcrypt')

// --------------------------------------------------------------- >> GET:USERS
exports.get_users = async (req, res) => {
    try {
      const allUsers = await User.find({})
      res.json(allUsers)
    } catch (e) {
      res.status(500).send(e.message)
    }
}

// ------------------------------------------------------------- >> GET:USER:ID
exports.get_user = async (req, res) => {
    const { id } = req.params
    try {
      const targetUser = await User.findById(id)
      if (!targetUser) return res.status(404).send('No such user')
      res.json(targetUser)
    } catch (e) {
      res.status(500).send(e.message)
    }
}

// --------------------------------------------------------------- >> POST:USER
exports.create_user = async (req, res) => {
  const { first_name, last_name, email, password } = req.body

  try {
    const newUser = new User({ 
        first_name, last_name, email, password: await bcrypt.hash(password, 10) 
    })

    await newUser.save()

    const token = newUser.createToken()
    res.set('x-authorization-token', token).send('User created successfully')
    // res.json({
    //   token: newUser.createToken()
    // })
  } catch (e) {
    res.status(500).send(e.message)
  }
}

// ------------------------------------------------------------- >> PUT:USER:ID
exports.update_user = async (req, res) => {
    const { id } = req.params
    try {
        // TODO put logic
        res.json("TODOOOOO ")
    } catch (e) {
      res.status(500).send(e.message)
    }
}