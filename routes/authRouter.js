const express = require("express");
const router = express.Router();

const { validateFirstName, validateLastName, validateEmail, 
        validatePassword } = require('../validators') 

const {
    login,
    signup,
    resetPasswordRequestController,
    resetPasswordController
} = require('../controllers/authController');

router.post("/login", login);
router.post("/signup", [validateFirstName, validateLastName, validatePassword, 
                    validateEmail], signup);
router.post("/resetPasswordRequest", resetPasswordRequestController);
router.post("/resetPassword", resetPasswordController);

module.exports = router;