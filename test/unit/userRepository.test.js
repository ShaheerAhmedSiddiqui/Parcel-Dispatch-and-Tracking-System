jest.mock('../../src/config/db', () => ({ execute: jest.fn() }));
const pool = require('../../src/config/db');
const userRepository = require('../../src/repositories/userRepository');

describe('userRepository.getAvailableStaff', () => {
  beforeEach(() => jest.clearAllMocks());

  test('returns only active delivery staff marked AVAILABLE', async () => {
    const available = [{ staff_id: 4, availability: 'AVAILABLE' }];
    pool.execute.mockResolvedValue([available, []]);

    await expect(userRepository.getAvailableStaff()).resolves.toEqual(available);

    const [sql] = pool.execute.mock.calls[0];
    expect(sql).toContain("u.role = 'DELIVERY_STAFF'");
    expect(sql).toContain('u.is_active = TRUE');
    expect(sql).toContain("ds.availability = 'AVAILABLE'");
  });
});
