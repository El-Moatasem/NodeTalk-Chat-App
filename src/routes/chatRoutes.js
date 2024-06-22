// src/routes/chatRoutes.js
const express = require('express');
const chatController = require('../controllers/chatController');
const auth = require('../middleware/auth');
const router = express.Router();


if (!chatController.createRoom || !chatController.joinRoom || !chatController.leaveRoom || 
    !chatController.sendMessage || !chatController.getMessages || !chatController.getChatRooms ||
    !chatController.editMessage || !chatController.deleteMessage || !chatController.searchMessages) {
    throw new Error('One or more chatController methods are undefined');
}

router.post('/create-room', auth, chatController.createRoom);
router.post('/join-room', auth, chatController.joinRoom);
router.post('/leave-room', auth, chatController.leaveRoom);
router.post('/send-message', auth, chatController.sendMessage);
router.get('/messages/:roomId', auth, chatController.getMessages);
router.get('/rooms', auth, chatController.getChatRooms);
router.post('/edit-message', auth, chatController.editMessage);
router.post('/delete-message', auth, chatController.deleteMessage);
router.get('/search-messages', auth, chatController.searchMessages);
router.get('/private-room', auth, chatController.getPrivateRoom);
router.get('/private-rooms', auth, chatController.getPrivateRoomsForUser);

module.exports = router;
