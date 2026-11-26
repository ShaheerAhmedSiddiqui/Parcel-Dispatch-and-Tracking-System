const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');

// Display login page
function showLogin(req, res) {
    res.render('login', {
        title: 'Staff Login',
        errorMessage: null
    });
}

// Process login
async function login(req, res, next) {
    try {
        const email = (req.body.email || '').trim().toLowerCase();
        const password = req.body.password || '';

        if (!email || !password) {
            return res.status(400).render('login', {
                title: 'Staff Login',
                errorMessage: 'Please enter your email and password.'
            });
        }

        const user = await userRepository.findByEmail(email);

        // Use a generic message to avoid revealing whether an account exists.
        if (!user || !user.is_active) {
            return res.status(401).render('login', {
                title: 'Staff Login',
                errorMessage: 'Invalid email or password.'
            });
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatches) {
            return res.status(401).render('login', {
                title: 'Staff Login',
                errorMessage: 'Invalid email or password.'
            });
        }

        if (!['ADMIN', 'DELIVERY_STAFF'].includes(user.role)) {
            return res.status(403).render('login', {
                title: 'Staff Login',
                errorMessage: 'This account does not have staff access.'
            });
        }

        // Regenerate session ID after successful login.
        req.session.regenerate((error) => {
            if (error) {
                return next(error);
            }

            // Store only necessary user information in the session.
            req.session.user = {
                userId: user.user_id,
                fullName: user.full_name,
                username: user.username,
                email: user.email,
                role: user.role
            };

            req.session.save((saveError) => {
                if (saveError) {
                    return next(saveError);
                }

                if (user.role === 'ADMIN') {
                    return res.redirect('/admin/dashboard');
                }

                return res.redirect('/staff');
            });
        });

    } catch (error) {
        next(error);
    }
}

// Logout
function logout(req, res, next) {
    req.session.destroy((error) => {
        if (error) {
            return next(error);
        }

        res.clearCookie('connect.sid');
        return res.redirect('/login');
    });
}

module.exports = {
    showLogin,
    login,
    logout
};