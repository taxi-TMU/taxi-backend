const express = require("express");
const router = express.Router();

const subCategoryController = require('../controllers/subCategoryController');


// ------------------------------------------------------- >> GET:SUBCATEGORIES
router.get("/", subCategoryController.list_sub_categories);
// ------------------------------------------------------ >> GET:SUBCATEGORY:ID
router.get("/:id", subCategoryController.find_sub_category);
// -------------------------------------------------------- >> POST:SUBCATEGORY
router.post("/", subCategoryController.create_sub_category);
// ------------------------------------------------------ >> PUT:SUBCATEGORY:ID
// router.put("/:id", subCategoryController.update_sub_category);

module.exports = router;