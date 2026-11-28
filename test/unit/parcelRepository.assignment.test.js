jest.mock('../../src/config/db', () => ({ getConnection: jest.fn() }));
const pool = require('../../src/config/db');
const parcelRepository = require('../../src/repositories/parcelRepository');

function makeConnection() {
  return {
    beginTransaction: jest.fn().mockResolvedValue(),
    execute: jest.fn(),
    commit: jest.fn().mockResolvedValue(),
    rollback: jest.fn().mockResolvedValue(),
    release: jest.fn(),
  };
}

describe('parcelRepository.assignStaff availability rules', () => {
  beforeEach(() => jest.clearAllMocks());

  test('rejects a BUSY or OFF_DUTY profile', async () => {
    const connection = makeConnection();
    connection.execute
      .mockResolvedValueOnce([[{ parcel_id: 21, current_status: 'Booked' }], []])
      .mockResolvedValueOnce([[], []]);
    pool.getConnection.mockResolvedValue(connection);

    await expect(parcelRepository.assignStaff(21, 8, 2)).rejects.toMatchObject({
      message: 'Available delivery staff member not found.',
      status: 409,
    });
    expect(connection.execute.mock.calls[1][0]).toContain("ds.availability = 'AVAILABLE'");
    expect(connection.execute).toHaveBeenCalledTimes(2);
    expect(connection.rollback).toHaveBeenCalledTimes(1);
    expect(connection.release).toHaveBeenCalledTimes(1);
    expect(connection.commit).not.toHaveBeenCalled();
  });

  test('marks a selected AVAILABLE profile BUSY in the assignment transaction', async () => {
    const connection = makeConnection();
    connection.execute
      .mockResolvedValueOnce([[{ parcel_id: 22, current_status: 'Booked' }], []])
      .mockResolvedValueOnce([[{ staff_id: 9 }], []])
      .mockResolvedValueOnce([{ affectedRows: 1 }, []])
      .mockResolvedValueOnce([{ affectedRows: 1 }, []])
      .mockResolvedValueOnce([{ insertId: 1 }, []]);
    pool.getConnection.mockResolvedValue(connection);

    await expect(parcelRepository.assignStaff(22, 9, 2)).resolves.toEqual({
      parcelId: 22, assignedStaffId: 9, currentStatus: 'Assigned',
    });

    expect(connection.execute.mock.calls[2][0]).toContain("SET availability = 'BUSY'");
    expect(connection.commit).toHaveBeenCalledTimes(1);
    expect(connection.rollback).not.toHaveBeenCalled();
    expect(connection.release).toHaveBeenCalledTimes(1);
  });
});
