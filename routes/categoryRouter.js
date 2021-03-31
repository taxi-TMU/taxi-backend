const express = require("express");
const router = express.Router();

const {
    get_all,
    get_by_id,
    create,
    update
} = require('../controllers/categoryController');

router.get("/", get_all);
router.get("/:id", get_by_id);
router.post("/", create);
router.put("/:id", update);

module.exports = router;