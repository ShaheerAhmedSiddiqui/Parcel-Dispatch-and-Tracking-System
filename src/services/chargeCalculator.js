
/**
 * Calculate delivery charges using database pricing rules.
 *
 * Formula:
 * Base Charge + (Weight × Per KG Rate) + (Distance × Per KM Rate)
 */

function calculateCharge({ weight, distance, pricingRule }) {
    const parcelWeight = Number(weight);
    const parcelDistance = Number(distance);

    if (!Number.isFinite(parcelWeight) || parcelWeight <= 0) {
        throw new Error('Parcel weight must be greater than zero.');
    }

    if (!Number.isFinite(parcelDistance) || parcelDistance < 0) {
        throw new Error('Distance cannot be negative.');
    }

    if (!pricingRule) {
        throw new Error('Pricing rule not found.');
    }

    const baseCharge = Number(pricingRule.base_charge);
    const perKgRate = Number(pricingRule.per_kg_rate);
    const perKmRate = Number(pricingRule.per_km_rate);

    const values = [baseCharge, perKgRate, perKmRate];

    if (values.some(value => !Number.isFinite(value) || value < 0)) {
        throw new Error('Invalid pricing configuration.');
    }

    const total =
        baseCharge +
        (parcelWeight * perKgRate) +
        (parcelDistance * perKmRate);

    return Number(total.toFixed(2));
}

module.exports = { calculateCharge };
