
const STATUSES = Object.freeze({
    BOOKED: 'Booked',
    ASSIGNED: 'Assigned',
    DISPATCHED: 'Dispatched',
    OUT_FOR_DELIVERY: 'Out for Delivery',
    DELIVERED: 'Delivered',
    DELIVERY_FAILED: 'Delivery Failed',
    RETURN_INITIATED: 'Return Initiated',
    RETURN_IN_TRANSIT: 'Return in Transit',
    RETURNED_TO_SENDER: 'Returned to Sender'
});

const TRANSITIONS = {
    [STATUSES.BOOKED]: [
        STATUSES.ASSIGNED
    ],

    [STATUSES.ASSIGNED]: [
        STATUSES.DISPATCHED,
        STATUSES.BOOKED
    ],

    [STATUSES.DISPATCHED]: [
        STATUSES.OUT_FOR_DELIVERY
    ],

    [STATUSES.OUT_FOR_DELIVERY]: [
        STATUSES.DELIVERED,
        STATUSES.DELIVERY_FAILED
    ],

    [STATUSES.DELIVERY_FAILED]: [
        STATUSES.OUT_FOR_DELIVERY,
        STATUSES.RETURN_INITIATED
    ],

    [STATUSES.RETURN_INITIATED]: [
        STATUSES.RETURN_IN_TRANSIT
    ],

    [STATUSES.RETURN_IN_TRANSIT]: [
        STATUSES.RETURNED_TO_SENDER
    ],

    [STATUSES.DELIVERED]: [],
    [STATUSES.RETURNED_TO_SENDER]: []
};

function canTransition(currentStatus, nextStatus) {
    return Boolean(
        TRANSITIONS[currentStatus]?.includes(nextStatus)
    );
}

function getPermittedStatuses(currentStatus) {
    return TRANSITIONS[currentStatus] || [];
}

function validateTransition(currentStatus, nextStatus) {
    if (!canTransition(currentStatus, nextStatus)) {
        throw new Error(
            `Invalid status transition: ${currentStatus} → ${nextStatus}`
        );
    }

    return true;
}

module.exports = {
    STATUSES,
    TRANSITIONS,
    canTransition,
    getPermittedStatuses,
    validateTransition
};
