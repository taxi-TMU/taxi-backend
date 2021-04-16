/* eslint-disable camelcase */
const express = require('express');

const router = express.Router();

const {
  testrun,
} = require('../controllers/testRunController');

router.get('/', testrun);

module.exports = router;
