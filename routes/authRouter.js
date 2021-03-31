const express = require("express");
const router = express.Router();

const { login } = require('../controllers/authController');

router.post("/login", login);
// router.put("/update-password/:user_id/:payload", login);

module.exports = router;