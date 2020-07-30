const express = require('express');
const dummyController = require('../controllers/dummyController');

const router = express.Router();

router.get('/dummy', dummyController.getDummy);

module.exports = router;