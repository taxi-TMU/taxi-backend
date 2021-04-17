/* eslint-disable camelcase */
const express = require('express');

const router = express.Router();

const { validateUserId, validateSimulation } = require('../validators');

const {
  get_all,
  get_by_id,
  user_statistics,
  create,
  update,
} = require('../controllers/trainingController');

router.get('/stats/:id', user_statistics);
router.get('/', get_all);
router.get('/:id', get_by_id);
router.post('/', [validateUserId, validateSimulation], create);
router.put('/:id', update);

module.exports = router;
