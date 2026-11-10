// src/app.js
// Express application. Exported WITHOUT calling listen() so that
// Supertest can test routes without opening a real port.
// server.js is responsible for starting the server.

require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');

const authRoutes = require('./routes/auth');
const parcelRoutes = require('./routes/parcels');
const staffRoutes = require('./routes/staff');
const trackingRoutes = require('./routes/tracking');

const app = express();

// ---------- View engine (EJS) ----------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ---------- Core middleware ----------
app.use(express.urlencoded({ extended: false })); // HTML form bodies
app.use(express.json());                          // JSON bodies (API/tests)
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-only-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 2, // 2 hours
      secure: process.env.NODE_ENV === 'production',
    },
  })
);

// Make the logged-in user available in every EJS template
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

// ---------- Routes ----------
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.render('home', { title: 'Parcel Dispatch and Tracking System' });
});

app.use('/', authRoutes);                // /login, /logout
app.use('/track', trackingRoutes);       // public customer tracking
app.use('/parcels', parcelRoutes);       // ADMIN (and STAFF where permitted)
app.use('/staff', staffRoutes);          // STAFF delivery workflow

// ---------- 404 handler ----------
app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Page not found',
    message: 'The page you requested does not exist.',
    status: 404,
  });
});

// ---------- Central error handler ----------
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status >= 500) console.error(err);

  const message =
    status >= 500 && process.env.NODE_ENV === 'production'
      ? 'Something went wrong. Please try again later.'
      : err.message;

  // JSON for API clients / tests, HTML page for browsers
  if (req.accepts(['html', 'json']) === 'json') {
    return res.status(status).json({ error: message });
  }
  return res.status(status).render('error', {
    title: 'Error',
    message,
    status,
  });
});

module.exports = app;