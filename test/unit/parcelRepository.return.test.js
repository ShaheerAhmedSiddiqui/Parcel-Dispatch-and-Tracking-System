jest.mock('../../src/config/db', () => ({ getConnection: jest.fn() }));
const pool = require('../../src/config/db');
const parcelRepository = require('../../src/repositories/parcelRepository');

describe('parcelRepository.updateStatus return completion', () => {
  beforeEach(() => jest.clearAllMocks());

  test('persists completed_at and releases assigned staff through normal status update', async () => {
    const connection = {
      beginTransaction: jest.fn().mockResolvedValue(),
      execute: jest.fn()
        .mockResolvedValueOnce([[
          { parcel_id: 31, current_status: 'Return in Transit', assigned_staff_id: 15 },
        ], []])
        .mockResolvedValueOnce([{ affectedRows: 1 }, []])
        .mockResolvedValueOnce([[{ return_id: 4 }], []])
        .mockResolvedValueOnce([{ affectedRows: 1 }, []])
        .mockResolvedValueOnce([{ insertId: 8 }, []])
        .mockResolvedValueOnce([{ affectedRows: 1 }, []]),
      commit: jest.fn().mockResolvedValue(),
      rollback: jest.fn().mockResolvedValue(),
      release: jest.fn(),
    };
    pool.getConnection.mockResolvedValue(connection);

    await expect(parcelRepository.updateStatus(31, 'Returned to Sender', 2))
      .resolves.toEqual({ parcelId: 31, currentStatus: 'Returned to Sender' });

    expect(connection.execute.mock.calls[1][0]).toContain('SET completed_at = CURRENT_TIMESTAMP');
    expect(connection.execute.mock.calls[3][0]).toContain('current_status = ?');
    expect(connection.execute.mock.calls[5][0]).toContain("SET availability = 'AVAILABLE'");
    expect(connection.commit).toHaveBeenCalledTimes(1);
    expect(connection.rollback).not.toHaveBeenCalled();
    expect(connection.release).toHaveBeenCalledTimes(1);
  });
});
