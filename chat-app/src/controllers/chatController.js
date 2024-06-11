// src/controllers/chatController.js
const ChatRoom = require('../models/chatRoom');
const Message = require('../models/message');

exports.createRoom = async (req, res) => {
  try {
    const { name, isPrivate } = req.body;
    const chatRoom = new ChatRoom({ name, isPrivate });
    await chatRoom.save();
    res.status(201).json(chatRoom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.joinRoom = async (req, res) => {
  try {
    const { roomId } = req.body;
    const chatRoom = await ChatRoom.findById(roomId);
    chatRoom.members.push(req.user.userId);
    await chatRoom.save();
    res.json(chatRoom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.leaveRoom = async (req, res) => {
  try {
    const { roomId } = req.body;
    const chatRoom = await ChatRoom.findById(roomId);
    chatRoom.members.pull(req.user.userId);
    await chatRoom.save();
    res.json({ message: 'Left the room' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { roomId, content } = req.body;
    const message = new Message({ chatRoom: roomId, sender: req.user.userId, content });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await Message.find({ chatRoom: roomId }).populate('sender', 'username');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
