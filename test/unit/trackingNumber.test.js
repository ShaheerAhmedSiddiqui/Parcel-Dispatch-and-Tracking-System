const { generateTrackingNumber } = require('../../src/services/trackingNumber');

describe('trackingNumber', () => {
  test('UT-011 creates a PT-prefixed six-digit tracking number for a positive ID', () => {
    expect(generateTrackingNumber(1)).toBe('PT-000001');
    expect(generateTrackingNumber(42)).toBe('PT-000042');
    expect(generateTrackingNumber(123456)).toBe('PT-123456');
  });

  test('UT-012 accepts a numeric string parcel ID', () => {
    expect(generateTrackingNumber('7')).toBe('PT-000007');
  });

  test('UT-013 rejects non-positive, fractional, and non-numeric parcel IDs', () => {
    for (const parcelId of [0, -1, 1.5, 'abc', null, undefined]) {
      expect(() => generateTrackingNumber(parcelId)).toThrow(
        'A valid parcel ID is required.'
      );
    }
  });
});
