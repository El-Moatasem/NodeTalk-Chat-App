// src/services/chatService.js
const ChatRoom = require('../models/chatRoom');
const Message = require('../models/message');

const createRoom = async (name, isPrivate, members = []) => {
  if (isPrivate && Array.isArray(members) && members.length > 0) {
    const existingRoom = await ChatRoom.findOne({ isPrivate, members: { $all: members, $size: members.length } });
    if (existingRoom) {
      return existingRoom;
    }
  }

  const chatRoom = new ChatRoom({ name, isPrivate, members });
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
  const room = await ChatRoom.findById(roomId);

  if (!room) {
      throw new Error('Room not found');
  }

  room.members.pull(userId);
  await room.save();

  if (room.members.length === 0) {
      await ChatRoom.deleteOne({ _id: roomId });
      return { message: 'Room deleted as it has no members', roomDeleted: true };
  } else {
      return { message: 'Left the room', roomDeleted: false };
  }
};

const getRoomInfo = async (roomId) => {
  const room = await ChatRoom.findById(roomId).populate('members', 'username');
  if (!room) {
      throw new Error('Room not found');
  }
  return room;
};

// -------------------------------------------------------------------------------------




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

//==================================================================================================

const getPrivateRooms = async (userId) => {
  const privateRooms = await ChatRoom.find({ isPrivate: true, members: userId })
      .populate('members', 'username')
      .exec();
  return privateRooms;
};

const getPublicRooms = async () => {
  const rooms = await ChatRoom.find({ isPrivate: false });
  return rooms;
};

const findPrivateRoomByMembers = async (members) => {
  if (!Array.isArray(members) || members.length === 0) {
    throw new Error('Members array is invalid or empty');
  }

  const room = await ChatRoom.findOne({
    isPrivate: true,
    members: { $all: members, $size: members.length }
  }).populate('members', 'username');
  
  return room;
};




const findPrivateRoomsForUser = async (userId) => {
  const rooms = await ChatRoom.find({
    isPrivate: true,
    members: userId
  }).populate('members', 'username');
  return rooms;
};


const getRoomMembers = async (roomId) => {
  const room = await ChatRoom.findById(roomId).populate('members', 'username');
  if (!room) {
    throw new Error('Chat room not found');
  }
  return room.members;
};



//==================================================================================================


const editMessage = async (messageId, userId, newContent) => {
  const message = await Message.findById(messageId);

  if (!message) {
    throw new Error('Message not found');
  }

  if (!message.sender.equals(userId)) {
    throw new Error('You can only edit your own messages');
  }

  message.editHistory.push({ content: message.content });
  message.content = newContent;
  await message.save();

  return message;
};


const deleteMessage = async (messageId, userId) => {
  const message = await Message.findById(messageId);

  if (!message) {
    throw new Error('Message not found');
  }

  if (!message.sender.equals(userId)) {
    throw new Error('You can only delete your own messages');
  }

  await message.deleteOne(); // Changed from message.remove()
  return { message: 'Message deleted' };
};


//==================================================================================================

module.exports = {
  createRoom,
  joinRoom,
  leaveRoom,
  getRoomInfo,
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
  getChatRooms,
  getPrivateRooms,
  getPublicRooms,
  findPrivateRoomsForUser,
  findPrivateRoomByMembers,
  getRoomMembers,
};