
const parcelQueryRepository = require('../repositories/parcelQueryRepository');

async function showDashboard(req, res, next) {
    try {
        const [stats, recentParcels] = await Promise.all([
            parcelQueryRepository.getAdminDashboardStats(),
            parcelQueryRepository.getRecentParcels()
        ]);

        res.render('admin/dashboard', {
            title: 'Admin Dashboard',
            activePage: 'dashboard',
            stats,
            recentParcels
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    showDashboard
};
