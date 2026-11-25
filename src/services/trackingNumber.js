
function generateTrackingNumber(parcelId) {
    if (!Number.isInteger(Number(parcelId)) || Number(parcelId) <= 0) {
        throw new Error('A valid parcel ID is required.');
    }

    return `PT-${String(parcelId).padStart(6, '0')}`;
}

module.exports = { generateTrackingNumber };
