const parcelRepository = require('../repositories/parcelRepository');
const parcelQueryRepository = require('../repositories/parcelQueryRepository');
const pricingRepository = require('../repositories/pricingRepository');
const userRepository = require('../repositories/userRepository');

const { calculateCharge } = require('../services/chargeCalculator');
const { validateParcel } = require('../services/validators');
const {
    STATUSES,
    getPermittedStatuses
} = require('../services/statusMachine');

const DELIVERY_TYPES = ['STANDARD', 'EXPRESS', 'SAME_DAY'];

function getParcelInput(body) {
    return {
        sender_name: (body.senderName || '').trim(),
        sender_contact: (body.senderContact || '').trim(),
        receiver_name: (body.receiverName || '').trim(),
        receiver_contact: (body.receiverContact || '').trim(),
        pickup_address: (body.pickupAddress || '').trim(),
        delivery_address: (body.deliveryAddress || '').trim(),
        weight: body.weight,
        distance: body.distance === '' || body.distance == null
            ? 0
            : body.distance,
        delivery_type: (body.deliveryType || '').toUpperCase()
    };
}

async function calculateParcelQuote(data) {
    const pricingRule = await pricingRepository.findByDeliveryType(
        data.delivery_type
    );

    if (!pricingRule) {
        throw new Error('Pricing rule not found for this delivery type.');
    }

    return calculateCharge({
        weight: data.weight,
        distance: data.distance,
        pricingRule
    });
}

// GET /parcels
async function listParcels(req, res, next) {
    try {
        const filters = {
            search: (req.query.search || '').trim(),
            status: req.query.status || '',
            deliveryType: req.query.deliveryType || '',
            staffId: req.query.staffId || '',
            page: req.query.page
        };

        const result = await parcelQueryRepository.getParcelList(filters);
        const staffMembers = await userRepository.getAllStaff();

        return res.render('admin/parcels', {
            title: 'All Parcels',
            activePage: 'parcels',
            parcels: result.parcels,
            pagination: result.pagination,
            filters,
            staffMembers,
            statuses: Object.values(STATUSES),
            deliveryTypes: DELIVERY_TYPES
        });
    } catch (error) {
        next(error);
    }
}

// GET /parcels/new
function showRegisterForm(req, res) {
    return res.render('admin/register-parcel', {
        title: 'Register Parcel',
        activePage: 'register-parcel',
        deliveryTypes: DELIVERY_TYPES,
        errorMessage: null,
        formData: {}
    });
}

// POST /parcels/quote
async function getQuote(req, res) {
    try {
        const data = getParcelInput(req.body);

        if (!['STANDARD', 'EXPRESS', 'SAME_DAY'].includes(data.delivery_type)) {
            return res.status(400).json({
                success: false,
                message: 'Please select a valid delivery type.'
            });
        }

        const weight = Number(data.weight);
        const distance = Number(data.distance);

        if (!Number.isFinite(weight) || weight <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Weight must be greater than zero.'
            });
        }

        if (!Number.isFinite(distance) || distance < 0) {
            return res.status(400).json({
                success: false,
                message: 'Distance cannot be negative.'
            });
        }

        const deliveryCharge = await calculateParcelQuote(data);

        return res.json({
            success: true,
            data: {
                deliveryCharge
            }
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

// POST /parcels
async function createParcel(req, res, next) {
    try {
        const parcelData = getParcelInput(req.body);
        const validation = validateParcel(parcelData);

        if (!validation.isValid) {
            return res.status(400).render('admin/register-parcel', {
                title: 'Register Parcel',
                activePage: 'register-parcel',
                deliveryTypes: DELIVERY_TYPES,
                errorMessage: validation.errors.join(' '),
                formData: req.body
            });
        }

        const deliveryCharge = await calculateParcelQuote(parcelData);

        const result = await parcelRepository.createParcel(
            {
                ...parcelData,
                delivery_charge: deliveryCharge
            },
            req.session.user.userId
        );

        return res.redirect(
            `/parcels/${result.parcelId}?success=registered`
        );
    } catch (error) {
        next(error);
    }
}

// GET /parcels/:id
async function showParcelDetails(req, res, next) {
    try {
        const parcelId = Number(req.params.id);

        if (!Number.isInteger(parcelId) || parcelId <= 0) {
            return res.status(400).render('error', {
                title: 'Invalid Parcel',
                message: 'The parcel ID is invalid.',
                status: 400
            });
        }

        const parcel = await parcelRepository.findById(parcelId);

        if (!parcel) {
            return res.status(404).render('error', {
                title: 'Parcel Not Found',
                message: 'The requested parcel could not be found.',
                status: 404
            });
        }

        const [
            shipmentHistory,
            deliveryAttempts,
            assignedStaff,
            availableStaff
        ] = await Promise.all([
            parcelRepository.getShipmentHistory(parcelId),
            parcelRepository.getDeliveryAttempts(parcelId),
            parcelQueryRepository.getAssignedStaff(parcelId),
            userRepository.getAvailableStaff()
        ]);

        return res.render('admin/parcel-details', {
            title: `Parcel ${parcel.tracking_number}`,
            activePage: 'parcels',
            parcel,
            assignedStaff,
            availableStaff,
            shipmentHistory,
            deliveryAttempts,
            actions: {
                canAssign: parcel.current_status === STATUSES.BOOKED,
                canInitiateReturn: parcel.current_status === STATUSES.DELIVERY_FAILED,
                permittedStatuses: getPermittedStatuses(parcel.current_status)
            },
            successMessage: req.query.success === 'registered'
                ? 'Parcel registered successfully.'
                : null,
            errorMessage: null
        });
    } catch (error) {
        next(error);
    }
}

// POST /parcels/:id/assign
async function assignStaff(req, res, next) {
    try {
        const staffId = Number(req.body.staffId);

        if (!Number.isInteger(staffId) || staffId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Please select a valid delivery staff member.'
            });
        }

        await parcelRepository.assignStaff(
            Number(req.params.id),
            staffId,
            req.session.user.userId
        );

        return res.json({
            success: true,
            message: 'Delivery staff assigned successfully.'
        });
    } catch (error) {
        if (error.status === 409) {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }

        next(error);
    }
}

// POST /parcels/:id/status
async function updateStatus(req, res, next) {
    try {
        const { status, remarks, failureReason } = req.body;

        await parcelRepository.updateStatus(
            Number(req.params.id),
            status,
            req.session.user.userId,
            { remarks, failureReason }
        );

        return res.json({
            success: true,
            message: 'Parcel status updated successfully.'
        });
    } catch (error) {
        next(error);
    }
}

// POST /parcels/:id/return
async function initiateReturn(req, res, next) {
    try {
        await parcelRepository.initiateReturn(
            Number(req.params.id),
            req.body.reason,
            req.session.user.userId
        );

        return res.json({
            success: true,
            message: 'Parcel return initiated successfully.'
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    listParcels,
    showRegisterForm,
    getQuote,
    createParcel,
    showParcelDetails,
    assignStaff,
    updateStatus,
    initiateReturn
};