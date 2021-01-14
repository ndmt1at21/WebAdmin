const express = require('express');
const userController = require('./../controller/userController');

const router = express.Router();

router.get('/all', userController.getUsers);

module.exports = router;
