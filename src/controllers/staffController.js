const staffRepository = require('../repositories/staffRepository');
const parcelRepository = require('../repositories/parcelRepository');

const {
    STATUSES,
    getPermittedStatuses
} = require('../services/statusMachine');

async function getCurrentStaff(req) {
    const staffId = await staffRepository.findStaffIdByUserId(
        req.session.user.userId
    );

    if (!staffId) {
        const error = new Error('Your delivery staff profile was not found.');
        error.status = 403;
        throw error;
    }

    return staffId;
}

// GET /staff
async function showDashboard(req, res, next) {
    try {
        const staffId = await getCurrentStaff(req);

        const filters = {
            search: (req.query.search || '').trim(),
            status: req.query.status || ''
        };

        const [stats, parcels] = await Promise.all([
            staffRepository.getDashboardStats(staffId),
            staffRepository.getStaffParcels(staffId, filters)
        ]);

        return res.render('staff/dashboard', {
            title: 'My Deliveries',
            activePage: 'dashboard',
            stats,
            parcels,
            filters,
            availableStatuses: [
                STATUSES.ASSIGNED,
                STATUSES.DISPATCHED,
                STATUSES.OUT_FOR_DELIVERY,
                STATUSES.DELIVERED,
                STATUSES.DELIVERY_FAILED,
                STATUSES.RETURN_INITIATED,
                STATUSES.RETURN_IN_TRANSIT,
                STATUSES.RETURNED_TO_SENDER
            ]
        });
    } catch (error) {
        next(error);
    }
}

// GET /staff/parcels/:id
async function showDeliveryDetails(req, res, next) {
    try {
        const staffId = await getCurrentStaff(req);
        const parcelId = Number(req.params.id);

        if (!Number.isInteger(parcelId) || parcelId <= 0) {
            return res.status(400).render('error', {
                title: 'Invalid Parcel',
                message: 'The parcel ID is invalid.',
                status: 400
            });
        }

        const parcel = await staffRepository.findAssignedParcel(
            parcelId,
            staffId
        );

        if (!parcel) {
            return res.status(404).render('error', {
                title: 'Parcel Not Found',
                message: 'This parcel was not found in your assigned deliveries.',
                status: 404
            });
        }

        const [shipmentHistory, deliveryAttempts] = await Promise.all([
            parcelRepository.getShipmentHistory(parcelId),
            parcelRepository.getDeliveryAttempts(parcelId)
        ]);

        // Staff can update delivery progress, but return initiation
        // remains an administrative action.
        const permittedStatuses = getPermittedStatuses(
            parcel.currentStatus
        ).filter(status => status !== STATUSES.RETURN_INITIATED);

        return res.render('staff/delivery-details', {
            title: `Delivery ${parcel.trackingNumber}`,
            activePage: 'deliveries',
            parcel,
            shipmentHistory,
            deliveryAttempts,
            permittedStatuses,
            successMessage: req.query.success === 'updated'
                ? 'Delivery status updated successfully.'
                : null,
            errorMessage: null
        });
    } catch (error) {
        next(error);
    }
}

// POST /staff/parcels/:id/status
async function updateDeliveryStatus(req, res, next) {
    try {
        const staffId = await getCurrentStaff(req);
        const parcelId = Number(req.params.id);

        if (!Number.isInteger(parcelId) || parcelId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid parcel ID.'
            });
        }

        // Confirm that this parcel belongs to the logged-in staff member.
        const parcel = await staffRepository.findAssignedParcel(
            parcelId,
            staffId
        );

        if (!parcel) {
            return res.status(404).json({
                success: false,
                message: 'This parcel is not assigned to you.'
            });
        }

        const nextStatus = req.body.status;

        if (
            nextStatus === STATUSES.RETURN_INITIATED ||
            !getPermittedStatuses(parcel.currentStatus).includes(nextStatus)
        ) {
            return res.status(400).json({
                success: false,
                message: 'This status update is not permitted.'
            });
        }

        await parcelRepository.updateStatus(
            parcelId,
            nextStatus,
            req.session.user.userId,
            {
                staffId,
                remarks: req.body.remarks,
                failureReason: req.body.failureReason
            }
        );

        return res.json({
            success: true,
            message: 'Delivery status updated successfully.'
        });
    } catch (error) {
        const status = error.status || 400;

        return res.status(status).json({
            success: false,
            message: error.message || 'Unable to update delivery status.'
        });
    }
}

module.exports = {
    showDashboard,
    showDeliveryDetails,
    updateDeliveryStatus
};