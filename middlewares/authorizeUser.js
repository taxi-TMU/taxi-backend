const jwt = require('jsonwebtoken')

const authorizeUser = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader) return res.status(400).send('No auth headers provided')
    // const token = authHeader.split(' ')[1]
    const [bearer, token] = authHeader.split(' ')

    console.log(token)
    if (!token) return res.status(401).send('Access denied')

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) return res.status(403).send('Access denied')
        // attach something to the request === giving context
        req.user = payload;
        next()
    })
}

module.exports = authorizeUser