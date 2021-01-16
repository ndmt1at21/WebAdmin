const express = require('express');
const viewController = require('./../controller/viewController');

const router = express.Router();

router.get('/dashboard', viewController.getDashboard);
router.get('/', viewController.getLogin);

module.exports = router;
