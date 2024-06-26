const userController = require('../src/controllers/userController');
const userService = require('../src/services/userService');
const { publishEvent } = require('../src/services/eventBus');

jest.mock('../src/services/userService');
jest.mock('../src/services/eventBus');

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

  describe('getUsers', () => {
    it('should fetch all users and publish an event', async () => {
      const users = [{ username: 'testuser1' }, { username: 'testuser2' }];
      userService.getUsers.mockResolvedValue(users);

      await userController.getUsers(req, res);

      expect(userService.getUsers).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(users);
      expect(publishEvent).toHaveBeenCalledWith('usersFetched', JSON.stringify(users));
    });

    it('should handle errors', async () => {
      const error = new Error('Something went wrong');
      userService.getUsers.mockRejectedValue(error);

      await userController.getUsers(req, res);

      expect(userService.getUsers).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getUserById', () => {
    it('should fetch a user by id and publish an event', async () => {
      const user = { username: 'testuser' };
      userService.getUserById.mockResolvedValue(user);

      await userController.getUserById(req, res);

      expect(userService.getUserById).toHaveBeenCalledWith('12345');
      expect(res.json).toHaveBeenCalledWith(user);
      expect(publishEvent).toHaveBeenCalledWith('userFetched', JSON.stringify(user));
    });

    it('should return 404 if user is not found', async () => {
      userService.getUserById.mockResolvedValue(null);

      await userController.getUserById(req, res);

      expect(userService.getUserById).toHaveBeenCalledWith('12345');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should handle errors', async () => {
      const error = new Error('Something went wrong');
      userService.getUserById.mockRejectedValue(error);

      await userController.getUserById(req, res);

      expect(userService.getUserById).toHaveBeenCalledWith('12345');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
});
