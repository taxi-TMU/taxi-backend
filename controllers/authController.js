const bcrypt = require('bcrypt')
const User = require('../models/userModel');

const login = async (req, res, next) => {

    const { email, password } = req.body

    let user = await User.findOne({ email })
    if (!user) return res.status(400).send('Invalid Credentials')

    const match = await bcrypt.compare(password, user.password)

    if (!match) return res.status(400).send(`Invalid Credentials`)

    const token = user.createToken()

    const obj = {
        msg: 'User logged in successfully',
        token: token
    }

    res.set('x-authorization-token', token).send(obj)

}

module.exports = {
    login
}