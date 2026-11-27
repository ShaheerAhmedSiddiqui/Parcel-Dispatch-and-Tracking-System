const { calculateCharge } = require('../../src/services/chargeCalculator');

const validPricingRule = {
  base_charge: 100,
  per_kg_rate: 10,
  per_km_rate: 3,
};

describe('chargeCalculator', () => {
  test('UT-001 calculates base, weight, and distance charges', () => {
    const result = calculateCharge({
      weight: 2,
      distance: 5,
      pricingRule: validPricingRule,
    });

    expect(result).toBe(135);
  });

  test('UT-002 accepts numeric strings and rounds to two decimal places', () => {
    const result = calculateCharge({
      weight: '1.25',
      distance: '2.5',
      pricingRule: {
        base_charge: '10',
        per_kg_rate: '2.10',
        per_km_rate: '0.35',
      },
    });

    expect(result).toBe(13.50);
  });

  test('UT-003 rejects zero, negative, and non-numeric weight', () => {
    for (const weight of [0, -0.01, 'not-a-number']) {
      expect(() =>
        calculateCharge({
          weight,
          distance: 0,
          pricingRule: validPricingRule,
        })
      ).toThrow('Parcel weight must be greater than zero.');
    }
  });

  test('UT-004 rejects negative or non-numeric distance', () => {
    for (const distance of [-0.01, 'unknown']) {
      expect(() =>
        calculateCharge({
          weight: 1,
          distance,
          pricingRule: validPricingRule,
        })
      ).toThrow('Distance cannot be negative.');
    }
  });

  test('UT-005 rejects missing and invalid pricing configuration', () => {
    expect(() =>
      calculateCharge({ weight: 1, distance: 1, pricingRule: null })
    ).toThrow('Pricing rule not found.');

    expect(() =>
      calculateCharge({
        weight: 1,
        distance: 1,
        pricingRule: {
          base_charge: -1,
          per_kg_rate: 2,
          per_km_rate: 3,
        },
      })
    ).toThrow('Invalid pricing configuration.');
  });
});
