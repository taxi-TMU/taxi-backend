const express = require("express");
const router = express.Router();

const questionController = require('../controllers/questionController');


// ----------------------------------------------------------- >> GET:QUESTIONS
router.get("/", questionController.list_questions);
// -------------------------------------------------------- >> GET:QUESTIONS:ID
router.get("/:id", questionController.find_question);
// ---------------------------------------------------------- >> POST:QUESTIONS
router.post("/", questionController.create_question);
// -------------------------------------------------------- >> PUT:QUESTIONS:ID
// router.put("/:id", questionController.update_question);

module.exports = router;