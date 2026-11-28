jest.mock('../../src/repositories/userRepository', () => ({
  findByEmail: jest.fn(),
  findByUsername: jest.fn(),
}));
jest.mock('bcryptjs', () => ({ compare: jest.fn() }));

const userRepository = require('../../src/repositories/userRepository');
const bcrypt = require('bcryptjs');
const authController = require('../../src/controllers/authController');

function response() {
  return { status: jest.fn().mockReturnThis(), render: jest.fn(), redirect: jest.fn() };
}
function request(body) {
  return {
    body,
    session: {
      regenerate: jest.fn((callback) => callback(null)),
      save: jest.fn((callback) => callback(null)),
    },
  };
}

describe('authController.login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    bcrypt.compare.mockResolvedValue(true);
  });

  test('authenticates an administrator using username', async () => {
    const user = {
      user_id: 1, full_name: 'Test Admin', username: 'testadmin',
      email: 'testadmin@parcel.test', password_hash: 'hash',
      role: 'ADMIN', is_active: 1,
    };
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.findByUsername.mockResolvedValue(user);

    const req = request({ identifier: 'TestAdmin', password: 'TestPass123!' });
    const res = response();
    const next = jest.fn();

    await authController.login(req, res, next);

    expect(userRepository.findByEmail).toHaveBeenCalledWith('testadmin');
    expect(userRepository.findByUsername).toHaveBeenCalledWith('testadmin');
    expect(bcrypt.compare).toHaveBeenCalledWith('TestPass123!', 'hash');
    expect(req.session.user.username).toBe('testadmin');
    expect(res.redirect).toHaveBeenCalledWith('/admin/dashboard');
    expect(next).not.toHaveBeenCalled();
  });

  test('keeps email login working through the legacy email field', async () => {
    const user = {
      user_id: 2, full_name: 'Test Rider', username: 'testrider',
      email: 'testrider@parcel.test', password_hash: 'hash',
      role: 'DELIVERY_STAFF', is_active: 1,
    };
    userRepository.findByEmail.mockResolvedValue(user);

    const req = request({ email: 'TESTRIDER@PARCEL.TEST', password: 'TestPass123!' });
    const res = response();
    const next = jest.fn();

    await authController.login(req, res, next);

    expect(userRepository.findByEmail).toHaveBeenCalledWith('testrider@parcel.test');
    expect(userRepository.findByUsername).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith('/staff');
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects missing identifier or password', async () => {
    const res = response();
    await authController.login(request({ identifier: '', password: '' }), res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.render).toHaveBeenCalledWith('login', expect.objectContaining({
      errorMessage: 'Please enter your username/email and password.',
    }));
    expect(userRepository.findByEmail).not.toHaveBeenCalled();
  });
});
