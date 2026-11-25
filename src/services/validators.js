
function isNonEmpty(value) {
    return typeof value === 'string' && value.trim().length > 0;
}

function isValidContact(value) {
    return typeof value === 'string' &&
        /^[0-9+\-\s()]{7,20}$/.test(value.trim());
}

function validateParcel(data) {
    const errors = [];

    const requiredFields = [
        'sender_name',
        'sender_contact',
        'receiver_name',
        'receiver_contact',
        'pickup_address',
        'delivery_address',
        'delivery_type'
    ];

    requiredFields.forEach(field => {
        if (!isNonEmpty(data[field])) {
            errors.push(`${field.replaceAll('_', ' ')} is required.`);
        }
    });

    if (!isValidContact(data.sender_contact)) {
        errors.push('Enter a valid sender contact number.');
    }

    if (!isValidContact(data.receiver_contact)) {
        errors.push('Enter a valid receiver contact number.');
    }

    const weight = Number(data.weight);

    if (!Number.isFinite(weight) || weight <= 0) {
        errors.push('Weight must be greater than zero.');
    }

    const distance = Number(data.distance);

    if (!Number.isFinite(distance) || distance < 0) {
        errors.push('Distance cannot be negative.');
    }

    const allowedDeliveryTypes = [
        'STANDARD',
        'EXPRESS',
        'SAME_DAY'
    ];

    if (!allowedDeliveryTypes.includes(data.delivery_type)) {
        errors.push('Invalid delivery type.');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

module.exports = {
    isNonEmpty,
    isValidContact,
    validateParcel
};
