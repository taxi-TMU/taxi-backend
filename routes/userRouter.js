/* eslint-disable camelcase */
const express = require('express');

const router = express.Router();

const {
  validateFirstName, validateLastName,
  validateIsActive,
} = require('../validators');

const {
  get_all,
  get_by_id,
  update,
} = require('../controllers/userController');

router.get('/', get_all);
router.get('/:id', get_by_id);
router.put('/:id', [validateFirstName, validateLastName, validateIsActive],
  update);

module.exports = router;
