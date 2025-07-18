import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import fleetioRoutes from './routes/fleetioRoutes.js';
import googleAuthRouter from './services/auth/googleAuthRouter.js';
import calendarRouter from './routes/calendarRouter.js';
import webhookRoutes from './routes/webhookRoutes.js';
import connectDB from './database/db.js';



//configure environment variables
dotenv.config();

// Add after dotenv.config()
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Cookie settings:', {
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production'
});


// Connect to the database
connectDB();

// Create an Express application
const app = express();



// Middleware to enable CORS
app.use(cors({
  origin: "https://fleetrics-frontend.onrender.com",
  credentials: true,
}));

// middleware to trust the first proxy
// This is important for secure cookies when using HTTPS
app.set('trust proxy', 1); // Trust first proxy for secure cookies


// Middleware to start/store session and data
app.use(session({ 
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: false ,
    cookie: {
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));


// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

//Routes

//Webhook route for Fleetio
app.use('/webhooks', webhookRoutes);

// Middleware to parse JSON
app.use(express.json());

// Google Authentication routes
app.use('/api/auth', googleAuthRouter);

// Fleetio API routes
app.use('/api/fleetio', fleetioRoutes);



//Calendar API routes
app.use('/api/calendar', calendarRouter);

const HOST = '0.0.0.0';

// Server listening
app.listen(process.env.PORT || 5000, HOST, () => {
    console.log(`Server is running on port ${HOST}:${process.env.PORT || 5000}`);
});