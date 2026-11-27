const {
  STATUSES,
  canTransition,
  getPermittedStatuses,
  validateTransition,
} = require('../../src/services/statusMachine');

describe('statusMachine', () => {
  test('UT-006 allows each forward workflow transition', () => {
    const validTransitions = [
      [STATUSES.BOOKED, STATUSES.ASSIGNED],
      [STATUSES.ASSIGNED, STATUSES.DISPATCHED],
      [STATUSES.DISPATCHED, STATUSES.OUT_FOR_DELIVERY],
      [STATUSES.OUT_FOR_DELIVERY, STATUSES.DELIVERED],
      [STATUSES.OUT_FOR_DELIVERY, STATUSES.DELIVERY_FAILED],
      [STATUSES.DELIVERY_FAILED, STATUSES.OUT_FOR_DELIVERY],
      [STATUSES.DELIVERY_FAILED, STATUSES.RETURN_INITIATED],
      [STATUSES.RETURN_INITIATED, STATUSES.RETURN_IN_TRANSIT],
      [STATUSES.RETURN_IN_TRANSIT, STATUSES.RETURNED_TO_SENDER],
    ];

    for (const [currentStatus, nextStatus] of validTransitions) {
      expect(canTransition(currentStatus, nextStatus)).toBe(true);
      expect(validateTransition(currentStatus, nextStatus)).toBe(true);
    }
  });

  test('UT-007 permits unassigning an Assigned parcel back to Booked', () => {
    expect(
      canTransition(STATUSES.ASSIGNED, STATUSES.BOOKED)
    ).toBe(true);
  });

  test('UT-008 rejects transitions that are not in the transition table', () => {
    expect(
      canTransition(STATUSES.BOOKED, STATUSES.DELIVERED)
    ).toBe(false);

    expect(() =>
      validateTransition(STATUSES.BOOKED, STATUSES.DELIVERED)
    ).toThrow('Invalid status transition');
  });

  test('UT-009 treats Delivered and Returned to Sender as terminal statuses', () => {
    expect(getPermittedStatuses(STATUSES.DELIVERED)).toEqual([]);
    expect(getPermittedStatuses(STATUSES.RETURNED_TO_SENDER)).toEqual([]);
  });

  test('UT-010 returns no permitted transitions for an unknown status', () => {
    expect(getPermittedStatuses('Unknown Status')).toEqual([]);
    expect(canTransition('Unknown Status', STATUSES.BOOKED)).toBe(false);
  });
});
