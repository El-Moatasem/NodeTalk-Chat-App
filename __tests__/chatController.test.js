const chatController = require('../src/controllers/chatController');
const chatService = require('../src/services/chatService');
const { publishEvent } = require('../src/services/eventBus');
const Message = require('../src/models/message'); // Import the Message model
const mongoose = require('mongoose');

jest.mock('../src/services/chatService');
jest.mock('../src/services/eventBus');
jest.mock('../src/models/message'); // Mock the Message model

jest.mock('mongoose', () => {
  const originalMongoose = jest.requireActual('mongoose');
  return {
    ...originalMongoose,
    Types: {
      ObjectId: jest.fn(id => id)
    }
  };
});

describe('Chat Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: { name: 'Test Room', isPrivate: false, members: [] },
      params: { roomId: '12345' },
      user: { _id: '67890' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  it('createRoom - should create a room and publish an event', async () => {
    chatService.createRoom.mockResolvedValue({ name: 'Test Room', isPrivate: false });
    await chatController.createRoom(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ name: 'Test Room', isPrivate: false });
    expect(publishEvent).toHaveBeenCalledWith('chatRoomCreated', JSON.stringify({ name: 'Test Room', isPrivate: false }));
  });

  it('joinRoom - should join a room and publish an event', async () => {
    chatService.joinRoom.mockResolvedValue({ roomId: '12345', userId: '67890' });
    req.body = { roomId: '12345' };
    await chatController.joinRoom(req, res);

    expect(res.json).toHaveBeenCalledWith({ roomId: '12345', userId: '67890' });
    expect(publishEvent).toHaveBeenCalledWith('userJoinedRoom', JSON.stringify({ roomId: '12345', userId: '67890' }));
  });

  it('leaveRoom - should leave a room and publish an event', async () => {
    chatService.leaveRoom.mockResolvedValue({ roomId: '12345', userId: '67890' });
    req.body = { roomId: '12345', userId: '67890' };
    await chatController.leaveRoom(req, res);

    expect(res.json).toHaveBeenCalledWith({ roomId: '12345', userId: '67890' });
    expect(publishEvent).toHaveBeenCalledWith('userLeftRoom', JSON.stringify({ roomId: '12345', userId: '67890' }));
  });

  it('sendMessage - should send a message and publish an event', async () => {
    const message = { roomId: '12345', content: 'Hello', sender: '67890' };
    chatService.sendMessage.mockResolvedValue(message);
    req.body = { roomId: '12345', content: 'Hello' };
    await chatController.sendMessage(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(message);
    expect(publishEvent).toHaveBeenCalledWith('messageSent', JSON.stringify(message));
  });

  it('getMessages - should fetch messages and publish an event', async () => {
    const messages = [{ content: 'Hello', sender: '67890' }];
    Message.find = jest.fn().mockReturnThis();
    Message.populate = jest.fn().mockResolvedValue(messages);

    await chatController.getMessages(req, res);

    expect(res.json).toHaveBeenCalledWith(messages);
    expect(publishEvent).toHaveBeenCalledWith('messagesFetched', JSON.stringify({ roomId: '12345', messages }));
  });

  it('editMessage - should edit a message and publish an event', async () => {
    const message = { _id: '12345', content: 'Edited message', sender: '67890' };
    chatService.editMessage.mockResolvedValue(message);
    req.body = { messageId: '12345', newContent: 'Edited message' };
    await chatController.editMessage(req, res);

    expect(res.json).toHaveBeenCalledWith(message);
    expect(publishEvent).toHaveBeenCalledWith('messageEdited', JSON.stringify(message));
  });

  it('deleteMessage - should delete a message and publish an event', async () => {
    const response = { messageId: '12345', status: 'deleted' };
    chatService.deleteMessage.mockResolvedValue(response);
    req.body = { messageId: '12345' };
    await chatController.deleteMessage(req, res);

    expect(res.json).toHaveBeenCalledWith(response);
    expect(publishEvent).toHaveBeenCalledWith('messageDeleted', JSON.stringify(response));
  });

  it('searchMessages - should search messages and publish an event', async () => {
    const messages = [{ content: 'Hello', sender: '67890' }];
    Message.find = jest.fn().mockReturnThis();
    Message.populate = jest.fn().mockResolvedValue(messages);
    req.query = { roomId: '12345', keyword: 'Hello' };
    await chatController.searchMessages(req, res);

    expect(res.json).toHaveBeenCalledWith(messages);
    expect(publishEvent).toHaveBeenCalledWith('messagesSearched', JSON.stringify({ roomId: '12345', keyword: 'Hello', messages }));
  });

  it('getChatRooms - should fetch chat rooms and publish an event', async () => {
    const chatRooms = [{ name: 'Test Room' }];
    chatService.getChatRooms.mockResolvedValue(chatRooms);
    await chatController.getChatRooms(req, res);

    expect(res.json).toHaveBeenCalledWith(chatRooms);
    expect(publishEvent).toHaveBeenCalledWith('chatRoomsFetched', JSON.stringify(chatRooms));
  });

  it('getPublicRooms - should fetch public rooms and publish an event', async () => {
    const rooms = [{ name: 'Public Room' }];
    chatService.getPublicRooms.mockResolvedValue(rooms);
    await chatController.getPublicRooms(req, res);

    expect(res.json).toHaveBeenCalledWith(rooms);
    expect(publishEvent).toHaveBeenCalledWith('publicRoomsRetrieved', JSON.stringify(rooms));
  });

  it('getPrivateRoomsForUser - should fetch private rooms for user and publish an event', async () => {
    const rooms = [{ name: 'Private Room' }];
    chatService.findPrivateRoomsForUser.mockResolvedValue(rooms);
    await chatController.getPrivateRoomsForUser(req, res);

    expect(res.json).toHaveBeenCalledWith(rooms);
    expect(publishEvent).toHaveBeenCalledWith('privateRoomsRetrieved', JSON.stringify(rooms));
  });

  it('findPrivateRoomByMembers - should find private room by members and publish an event', async () => {
    const room = { name: 'Private Room' };
    chatService.findPrivateRoomByMembers.mockResolvedValue(room);
    req.body = { members: ['67890'] };
    await chatController.findPrivateRoomByMembers(req, res);

    expect(res.json).toHaveBeenCalledWith(room);
    expect(publishEvent).toHaveBeenCalledWith('privateRoomByMembersFound', JSON.stringify(room));
  });

  it('getRoomMembers - should fetch room members and publish an event', async () => {
    const members = [{ username: 'testuser' }];
    chatService.getRoomMembers.mockResolvedValue(members);
    await chatController.getRoomMembers(req, res);

    expect(res.json).toHaveBeenCalledWith({ members });
    expect(publishEvent).toHaveBeenCalledWith('roomMembersRetrieved', JSON.stringify({ roomId: '12345', members }));
  });

  it('getRoomInfo - should fetch room info and publish an event', async () => {
    const room = { name: 'Test Room', isPrivate: false };
    chatService.getRoomInfo.mockResolvedValue(room);
    await chatController.getRoomInfo(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(room);
    expect(publishEvent).toHaveBeenCalledWith('roomInfoRetrieved', JSON.stringify(room));
  });
});
