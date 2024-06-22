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
  if (!mongoose.Types.ObjectId.isValid(roomId)) {
    throw new Error('Invalid roomId');
  }

  const message = new Message({ roomId, content, sender: mongoose.Types.ObjectId(userId) });
  await message.save();
  const populatedMessage = await message.populate('sender', 'username').execPopulate();
  return populatedMessage;
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
