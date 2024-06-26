const authController = require('../src/controllers/authController');
const authService = require('../src/services/authService');
const { publishEvent } = require('../src/services/eventBus');

jest.mock('../src/services/authService');
jest.mock('../src/services/eventBus');

describe('Auth Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: { username: 'testuser', email: 'test@example.com', password: 'password' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  it('register - should register a user and publish an event', async () => {
    const user = { _id: '12345', username: 'testuser', email: 'test@example.com' };
    const token = 'token';
    authService.register.mockResolvedValue({ user, token });
    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'User registered', user, token });
    expect(publishEvent).toHaveBeenCalledWith('userRegistered', JSON.stringify({ user, token }));
  });

  it('register - should handle errors', async () => {
    const error = new Error('Registration failed');
    authService.register.mockRejectedValue(error);
    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });

  it('login - should log in a user and publish an event', async () => {
    const user = { _id: '12345', username: 'testuser', email: 'test@example.com' };
    const token = 'token';
    authService.login.mockResolvedValue({ user, token });
    await authController.login(req, res);

    expect(res.json).toHaveBeenCalledWith({ user, token });
    expect(publishEvent).toHaveBeenCalledWith('userLoggedIn', JSON.stringify({ user, token }));
  });

  it('login - should handle errors', async () => {
    const error = new Error('Login failed');
    authService.login.mockRejectedValue(error);
    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });

  it('logout - should log out a user and publish an event', () => {
    const response = { message: 'User logged out' };
    authService.logout.mockReturnValue(response);
    authController.logout(req, res);

    expect(res.json).toHaveBeenCalledWith(response);
    expect(publishEvent).toHaveBeenCalledWith('userLoggedOut', JSON.stringify(response));
  });
});
