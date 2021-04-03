const express = require("express");
const router = express.Router();

const { validateFirstName, validateLastName, validateEmail, 
        validatePassword } = require('../validators') 

const {
    login,
    signup,
    emailConfirm,
    resetPasswordRequestController,
    resetPasswordController
} = require('../controllers/authController');

router.post("/signup", [validateFirstName, validateLastName, validatePassword, 
                    validateEmail], signup);
router.post("/login", login);
router.post("/emailConfirm/:secretCode/:userId", emailConfirm);
router.post("/resetPasswordRequest", [validateEmail],
                    resetPasswordRequestController);
router.post("/resetPassword", resetPasswordController);

module.exports = router;