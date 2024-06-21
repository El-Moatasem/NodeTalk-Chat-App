// src/routes/chatRoutes.js
const express = require('express');
const chatController = require('../controllers/chatController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/create-room', auth, chatController.createRoom);
router.post('/join-room', auth, chatController.joinRoom);
router.post('/leave-room', auth, chatController.leaveRoom);
router.post('/send-message', auth, chatController.sendMessage);
router.get('/messages/:roomId', auth, chatController.getMessages);
router.get('/rooms', auth, chatController.getChatRooms); // Add this line

module.exports = router;
