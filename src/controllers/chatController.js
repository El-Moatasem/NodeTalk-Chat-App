// src/controllers/chatController.js
const chatService = require('../services/chatService');
const mongoose = require('mongoose');
const Message = require('../models/message');
const { publishEvent } = require('../services/eventBus');


exports.createRoom = async (req, res) => {
  try {
    const { name, isPrivate, members } = req.body;
    if (isPrivate && Array.isArray(members) && members.length > 0) {
      const existingRoom = await chatService.findPrivateRoomByMembers(members);
      console.log("existingRoom_existingRoom: ", existingRoom)
      if (existingRoom) {
        res.status(200).json(existingRoom);
        return;
      }
    }
    const chatRoom = await chatService.createRoom(name, isPrivate, members);
    res.status(201).json(chatRoom);
    publishEvent('chatRoomCreated', JSON.stringify(chatRoom));
  } catch (error) {
    console.log("createRoom_error", error);
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
      const { roomId, userId } = req.body;
      const result = await chatService.leaveRoom(roomId, userId);
      res.json(result);
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
    publishEvent('messagesFetched', JSON.stringify({ roomId, messages })); // Added event
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
    const response = await chatService.deleteMessage(messageId, req.user._id);
    res.json(response);
    publishEvent('messageDeleted', JSON.stringify(response));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchMessages = async (req, res) => {
  try {
    const { roomId, keyword } = req.query;
    const messages = await Message.find({ roomId: mongoose.Types.ObjectId(roomId), content: new RegExp(keyword, 'i') }).populate('sender', 'username');
    res.json(messages);
    publishEvent('messagesSearched', JSON.stringify({ roomId, keyword, messages })); // Added event
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getChatRooms = async (req, res) => {
  try {
    const chatRooms = await chatService.getChatRooms();
    res.json(chatRooms);
    publishEvent('chatRoomsFetched', JSON.stringify(chatRooms)); // Added event
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPublicRooms = async (req, res) => {
  try {
      const rooms = await chatService.getPublicRooms();
      res.json(rooms);
      publishEvent('publicRoomsRetrieved', JSON.stringify(rooms));
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};


exports.getPrivateRoomsForUser = async (req, res) => {
  console.log("getPrivateRoomsForUser: ")
  try {
      const userId = req.user._id;
      const rooms = await chatService.findPrivateRoomsForUser(userId);
      // console.log("rooms: ", rooms)
      res.json(rooms);
      publishEvent('privateRoomsRetrieved', JSON.stringify(rooms));
  } catch (error) {
      
      res.status(500).json({ error: error.message });
  }
};


exports.findPrivateRoomByMembers = async (req, res) => {
  console.log("findPrivateRoomByMembers: ")
  try {
    const { members } = req.body;
    if (!Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ error: 'Members array is invalid or empty' });
    }

    const room = await chatService.findPrivateRoomByMembers(members);
    if (room) {
      res.status(200).json(room);
    } else {
      res.status(404).json({ message: 'No private room found for the provided members' });
    }

    publishEvent('privateRoomByMembersFound', JSON.stringify(room));
  } catch (error) {
    console.error('findPrivateRoomByMembers_error:', error);
    res.status(500).json({ error: error.message });
  }
};


exports.getRoomMembers = async (req, res) => {
  try {
    const { roomId } = req.params;
    const members = await chatService.getRoomMembers(roomId);
    res.json({ members });
    publishEvent('roomMembersRetrieved', JSON.stringify({ roomId, members }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


