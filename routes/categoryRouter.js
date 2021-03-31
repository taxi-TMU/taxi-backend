const express = require("express");
const router = express.Router();

const {
    get_all,
    get_by_id,
    create,
    update
} = require('../controllers/categoryController');

// --------------------------------------------------------------------- >> GET
router.get("/", get_all);
// ------------------------------------------------------------------ >> GET:ID
router.get("/:id", get_by_id);
// -------------------------------------------------------------------- >> POST
router.post("/", create);
// ------------------------------------------------------------------ >> PUT:ID
router.put("/:id", update);

module.exports = router;