// src/services/chatService.js
const ChatRoom = require('../models/chatRoom');
const Message = require('../models/message');

const createRoom = async (name, isPrivate) => {
  const chatRoom = new ChatRoom({ name, isPrivate });
  await chatRoom.save();
  return chatRoom;
};

const joinRoom = async (roomId, userId) => {
  const chatRoom = await ChatRoom.findById(roomId);
  if (!chatRoom) {
    throw new Error('Chat room not found');
  }

  chatRoom.members.push(userId);
  await chatRoom.save();
  return chatRoom;
};

const leaveRoom = async (roomId, userId) => {
  const chatRoom = await ChatRoom.findById(roomId);
  if (!chatRoom) {
    throw new Error('Chat room not found');
  }

  chatRoom.members.pull(userId);
  await chatRoom.save();
  return { message: 'Left the room' };
};

const sendMessage = async (roomId, userId, content) => {
  const message = new Message({ chatRoom: roomId, sender: userId, content });
  await message.save();
  return message;
};

const getMessages = async (roomId) => {
  const messages = await Message.find({ chatRoom: roomId }).populate('sender', 'username');
  return messages;
};

const getChatRooms = async () => {
  const chatRooms = await ChatRoom.find();
  return chatRooms;
};

module.exports = {
  createRoom,
  joinRoom,
  leaveRoom,
  sendMessage,
  getMessages,
  getChatRooms,
};
