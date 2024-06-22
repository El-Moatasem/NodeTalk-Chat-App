// src/controllers/chatController.js
const chatService = require('../services/chatService');
const mongoose = require('mongoose');
const Message = require('../models/message');
const { publishEvent } = require('../services/eventBus');

exports.createRoom = async (req, res) => {
  try {
    const { name, isPrivate } = req.body;
    const chatRoom = await chatService.createRoom(name, isPrivate);
    res.status(201).json(chatRoom);
    publishEvent('chatRoomCreated', JSON.stringify(chatRoom));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.joinRoom = async (req, res) => {
  try {
    const { roomId } = req.body;
    const chatRoom = await chatService.joinRoom(roomId, req.user._id);
    res.json(chatRoom);
    publishEvent('userJoinedRoom', JSON.stringify({ roomId, userId: req.user._id }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.leaveRoom = async (req, res) => {
  try {
    const { roomId } = req.body;
    const response = await chatService.leaveRoom(roomId, req.user._id);
    res.json(response);
    publishEvent('userLeftRoom', JSON.stringify({ roomId, userId: req.user._id }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { roomId, content } = req.body;
    const sender = req.user._id;

    const populatedMessage = await chatService.sendMessage(roomId, sender, content);
    res.status(201).json(populatedMessage);
    publishEvent('messageSent', JSON.stringify(populatedMessage));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await Message.find({ roomId: mongoose.Types.ObjectId(roomId) }).populate('sender', 'username');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.editMessage = async (req, res) => {
  try {
    const { messageId, newContent } = req.body;
    const message = await chatService.editMessage(messageId, req.user._id, newContent);
    res.json(message);
    publishEvent('messageEdited', JSON.stringify(message));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.body;
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (!message.sender.equals(req.user._id)) {
      return res.status(403).json({ error: 'You can only delete your own messages' });
    }

    await message.remove();
    res.json({ message: 'Message deleted' });
    publishEvent('messageDeleted', JSON.stringify(message));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchMessages = async (req, res) => {
  try {
    const { roomId, keyword } = req.query;
    const messages = await Message.find({ roomId: mongoose.Types.ObjectId(roomId), content: new RegExp(keyword, 'i') }).populate('sender', 'username');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getChatRooms = async (req, res) => {
  try {
    const chatRooms = await chatService.getChatRooms();
    res.json(chatRooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
