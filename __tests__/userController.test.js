const userController = require('../src/controllers/userController');
const userService = require('../src/services/userService');
const { publishEvent } = require('../src/services/eventBus');
const { getCache, setCache } = require('../src/services/cacheService');

jest.mock('../src/services/userService');
jest.mock('../src/services/eventBus');
jest.mock('../src/services/cacheService');

describe('User Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: '12345' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  it('getUsers - should fetch users and publish an event', async () => {
    const users = [{ _id: '12345', username: 'testuser' }];
    getCache.mockResolvedValue(null);
    userService.getUsers.mockResolvedValue(users);
    
    await userController.getUsers(req, res);

    expect(res.json).toHaveBeenCalledWith(users);
    expect(publishEvent).toHaveBeenCalledWith('usersFetched', JSON.stringify(users));
    expect(setCache).toHaveBeenCalledWith('users', users);
  });

  it('getUsers - should return cached users if available', async () => {
    const cachedUsers = [{ _id: '12345', username: 'cacheduser' }];
    getCache.mockResolvedValue(cachedUsers);
    
    await userController.getUsers(req, res);

    expect(res.json).toHaveBeenCalledWith(cachedUsers);
    expect(userService.getUsers).not.toHaveBeenCalled();
  });


  it('getUserById - should fetch user by ID and publish an event', async () => {
    const user = { _id: '12345', username: 'testuser' };
    getCache.mockResolvedValue(null);
    userService.getUserById.mockResolvedValue(user);
    
    await userController.getUserById(req, res);

    expect(res.json).toHaveBeenCalledWith(user);
    expect(publishEvent).toHaveBeenCalledWith('userFetched', JSON.stringify(user));
    expect(setCache).toHaveBeenCalledWith(`user:12345`, user);
  });

  it('getUserById - should return cached user if available', async () => {
    const cachedUser = { _id: '12345', username: 'cacheduser' };
    getCache.mockResolvedValue(cachedUser);
    
    await userController.getUserById(req, res);

    expect(res.json).toHaveBeenCalledWith(cachedUser);
    expect(userService.getUserById).not.toHaveBeenCalled();
  });

  it('getUserById - should handle user not found', async () => {
    getCache.mockResolvedValue(null);
    userService.getUserById.mockResolvedValue(null);
    
    await userController.getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
  });

  it('getUserById - should handle errors', async () => {
    const error = new Error('Error fetching user');
    userService.getUserById.mockRejectedValue(error);
    
    await userController.getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });
});
