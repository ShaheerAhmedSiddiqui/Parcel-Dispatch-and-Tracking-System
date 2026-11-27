const {
  isNonEmpty,
  isValidContact,
  validateParcel,
} = require('../../src/services/validators');

function validParcel(overrides = {}) {
  return {
    sender_name: 'Test Sender',
    sender_contact: '03001234567',
    receiver_name: 'Test Receiver',
    receiver_contact: '03007654321',
    pickup_address: 'Synthetic Pickup Address',
    delivery_address: 'Synthetic Delivery Address',
    weight: 1,
    distance: 0,
    delivery_type: 'STANDARD',
    ...overrides,
  };
}

describe('validators', () => {
  test('UT-014 accepts a complete parcel with valid values', () => {
    expect(validateParcel(validParcel())).toEqual({
      isValid: true,
      errors: [],
    });
  });

  test('UT-015 rejects missing or whitespace-only required fields', () => {
    const result = validateParcel(
      validParcel({
        sender_name: ' ',
        pickup_address: '',
        delivery_type: '',
      })
    );

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('sender name is required.');
    expect(result.errors).toContain('pickup address is required.');
    expect(result.errors).toContain('delivery type is required.');
  });

  test('UT-016 accepts contact lengths 7 and 20 and rejects 6 and 21', () => {
    expect(isValidContact('1234567')).toBe(true);
    expect(isValidContact('12345678901234567890')).toBe(true);
    expect(isValidContact('123456')).toBe(false);
    expect(isValidContact('123456789012345678901')).toBe(false);
    expect(isValidContact('ABC12345')).toBe(false);
  });

  test('UT-017 rejects zero/negative weight and negative/non-numeric distance', () => {
    for (const value of [0, -0.01, 'invalid']) {
      expect(validateParcel(validParcel({ weight: value })).isValid).toBe(false);
    }

    for (const value of [-0.01, 'invalid']) {
      expect(validateParcel(validParcel({ distance: value })).isValid).toBe(false);
    }
  });

  test('UT-018 accepts the configured delivery-type values', () => {
    for (const delivery_type of ['STANDARD', 'EXPRESS', 'SAME_DAY']) {
      expect(
        validateParcel(validParcel({ delivery_type })).isValid
      ).toBe(true);
    }
  });

  test('UT-019 rejects unsupported delivery types and invalid contacts', () => {
    const result = validateParcel(
      validParcel({
        delivery_type: 'OVERNIGHT',
        sender_contact: 'letters-only',
      })
    );

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Invalid delivery type.');
    expect(result.errors).toContain('Enter a valid sender contact number.');
  });

  test('isNonEmpty accepts non-blank strings only', () => {
    expect(isNonEmpty('value')).toBe(true);
    expect(isNonEmpty('   ')).toBe(false);
    expect(isNonEmpty(null)).toBe(false);
  });
});
