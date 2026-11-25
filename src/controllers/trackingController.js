const parcelRepository = require('../repositories/parcelRepository');

// Display tracking page and process tracking searches.
async function showTracking(req, res, next) {
    try {
        const trackingNumber = (
            req.query.trackingNumber || ''
        ).trim().toUpperCase();

        // Initial page visit: show the empty tracking form.
        if (!trackingNumber) {
            return res.render('tracking', {
                title: 'Track Your Parcel',
                trackingNumber: '',
                parcel: null,
                shipmentHistory: [],
                errorMessage: null
            });
        }

        // Basic tracking number validation.
        if (!/^PT-\d{6}$/.test(trackingNumber)) {
            return res.status(400).render('tracking', {
                title: 'Track Your Parcel',
                trackingNumber,
                parcel: null,
                shipmentHistory: [],
                errorMessage: 'Please enter a valid tracking number.'
            });
        }

        // Find parcel.
        const foundParcel =
            await parcelRepository.findByTrackingNumber(trackingNumber);

        if (!foundParcel) {
            return res.status(404).render('tracking', {
                title: 'Track Your Parcel',
                trackingNumber,
                parcel: null,
                shipmentHistory: [],
                errorMessage: 'No parcel was found with this tracking number.'
            });
        }

        // Retrieve shipment history.
        const history =
            await parcelRepository.getShipmentHistory(foundParcel.parcel_id);

        // Expose only information safe for public tracking.
        const parcel = {
            trackingNumber: foundParcel.tracking_number,
            currentStatus: foundParcel.current_status,
            registeredAt: foundParcel.created_at,
            updatedAt: foundParcel.updated_at
        };

        const shipmentHistory = history.map(record => ({
            status: record.status,
            updatedAt: record.updated_at
        }));

        return res.render('tracking', {
            title: 'Track Your Parcel',
            trackingNumber,
            parcel,
            shipmentHistory,
            errorMessage: null
        });

    } catch (error) {
        next(error);
    }
}

module.exports = {
    showTracking
};