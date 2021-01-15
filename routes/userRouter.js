const express = require('express');
const userController = require('./../controller/userController');

const router = express.Router();

router.get('/all', userController.getUsers);
router.get('/view/:id', userController.getUserDetail);

module.exports = router;
