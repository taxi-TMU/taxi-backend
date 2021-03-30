const express = require("express");
const router = express.Router();

const trainingController = require('../controllers/trainingController');


// ----------------------------------------------------------- >> GET:TRAININGS
router.get("/", trainingController.list_trainings);
// --------------------------------------------------------- >> GET:TRAINING:ID
router.get("/:id", trainingController.find_training);
// ----------------------------------------------------------- >> POST:TRAINING
router.post("/", trainingController.create_training);
// --------------------------------------------------------- >> PUT:TRAINING:ID
// router.put("/:id", trainingController.update_training);

module.exports = router;