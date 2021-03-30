const express = require("express");
const router = express.Router();

const userController = require('../controllers/userController');

// TODO const authorize = require('../middlewares/authorizeUser')

// --------------------------------------------------------------- >> GET:USERS
router.get("/", userController.list_users);
// ------------------------------------------------------------- >> GET:USER:ID
router.get("/:id", userController.find_user);
// --------------------------------------------------------------- >> POST:USER
router.post("/", userController.create_user);
// ------------------------------------------------------------- >> PUT:USER:ID
// router.put("/:id", userController.update_user);

module.exports = router;