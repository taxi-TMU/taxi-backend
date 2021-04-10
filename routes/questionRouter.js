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
  delete_all,
  get_by_sub_category_id,
} = require('../controllers/questionController');

router.get('/', get_all);
router.get('/:id', get_by_id);
router.get('/set/:sub_category_id', get_by_sub_category_id);
router.post('/', [validateLanguage, validateQuestion, validateSubCategoryId],
  create);
router.put('/:id', [validateLanguage, validateQuestion, validateSubCategoryId],
  update);
router.delete('/', delete_all);

module.exports = router;
