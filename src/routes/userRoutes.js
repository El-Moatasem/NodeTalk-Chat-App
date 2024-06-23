// src/routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, userController.getUsers);
router.get('/:id', auth, userController.getUserById); 
module.exports = router;
