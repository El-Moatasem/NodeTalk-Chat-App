// src/controllers/chatController.js
const chatService = require('../services/chatService');

exports.createRoom = async (req, res) => {
  try {
    const { name, isPrivate } = req.body;
    const chatRoom = await chatService.createRoom(name, isPrivate);
    res.status(201).json(chatRoom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.joinRoom = async (req, res) => {
  try {
    const { roomId } = req.body;
    const chatRoom = await chatService.joinRoom(roomId, req.user._id);
    res.json(chatRoom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.leaveRoom = async (req, res) => {
  try {
    const { roomId } = req.body;
    const response = await chatService.leaveRoom(roomId, req.user._id);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { roomId, content } = req.body;
    const message = await chatService.sendMessage(roomId, req.user._id, content);
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await chatService.getMessages(roomId);
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
