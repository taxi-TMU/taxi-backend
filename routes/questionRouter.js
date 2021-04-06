/* eslint-disable camelcase */
const express = require('express');

const router = express.Router();

const {
  validateLanguage, validateQuestion,
  validateSubCategoryId,
} = require('../validators');

const {
  get_all,
  get_by_id,
  create,
  update,
} = require('../controllers/questionController');

router.get('/', get_all);
router.get('/:id', get_by_id);
router.post('/', [validateLanguage, validateQuestion, validateSubCategoryId],
  create);
router.put('/:id', [validateLanguage, validateQuestion, validateSubCategoryId],
  update);

module.exports = router;
