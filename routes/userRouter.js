const express = require("express");
const router = express.Router();

const { validateFirstName, validateLastName, validateEmail, 
    validatePassword, validateIsActive } = require('../validators') 

const {
    get_all,
    get_by_id,
    create,
    update
} = require('../controllers/userController');

router.get("/", get_all);
router.get("/:id", get_by_id);
router.post("/", [validateFirstName, validateLastName, validatePassword, 
                    validateEmail], create);
router.put("/:id", [validateFirstName, validateLastName, validateIsActive],
                    update);

module.exports = router;