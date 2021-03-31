const express = require("express");
const router = express.Router();

const categoryController = require('../controllers/categoryController');


// ---------------------------------------------------------- >> GET:CATEGORIES
router.get("/", categoryController.get_categories);
// --------------------------------------------------------- >> GET:CATEGORY:ID
router.get("/:id", categoryController.get_category);
// ----------------------------------------------------------- >> POST:CATEGORY
router.post("/", categoryController.create_category);
// --------------------------------------------------------- >> PUT:CATEGORY:ID
router.put("/:id", categoryController.update_category);

module.exports = router;