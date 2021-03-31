const express = require("express");
const router = express.Router();

const { validateName, validateCategoryId } = require('../validators') 

const {
    get_all,
    get_by_id,
    create,
    update
} = require('../controllers/subCategoryController');

router.get("/", get_all);
router.get("/:id", get_by_id);
router.post("/", [validateName, validateCategoryId], create);
router.put("/:id", [validateName, validateCategoryId], update);

module.exports = router;