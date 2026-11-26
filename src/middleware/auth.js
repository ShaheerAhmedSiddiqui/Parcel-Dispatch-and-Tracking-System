// Authentication and authorization middleware

function requireAuth(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.redirect('/login');
    }

    next();
}

function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.session || !req.session.user) {
            return res.redirect('/login');
        }

        if (!allowedRoles.includes(req.session.user.role)) {
            return res.status(403).render('error', {
                title: 'Access denied',
                message: 'You are not authorized to access this page.',
                status: 403
            });
        }

        next();
    };
}

function redirectIfAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        if (req.session.user.role === 'ADMIN') {
            return res.redirect('/admin/dashboard');
        }

        if (req.session.user.role === 'DELIVERY_STAFF') {
            return res.redirect('/staff');
        }
    }

    next();
}

module.exports = {
    requireAuth,
    requireRole,
    redirectIfAuthenticated
};