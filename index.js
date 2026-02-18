import express from 'express'
import 'dotenv/config'
import cors from 'cors';
import helmet from 'helmet'
import morgan from 'morgan'
import session from 'express-session'
import authUserRouter from './routes/authUserRouter.js'
import vendorRouter from './routes/vendorRouter.js'
import productRouter from './routes/productRouter.js'
import categoryRouter from './routes/categoryRouter.js'
import cartRouter from './routes/cartRouter.js'
import orderRouter from './routes/orderRouter.js'
import adminRouter from './routes/adminRouter.js'
import paymentRouter from './routes/paymentRouter.js'
import couponRouter from './routes/couponRouter.js'
import passport from './middleware/passportMiddleware.js'
import { testEmailConnection } from './config/emailConfig.js';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static('uploads'));

// Test email connection on startup (optional)
testEmailConnection();

// Session configuration for Passport
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authUserRouter);
app.use('/api/vendor', vendorRouter);
app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);
app.use('/api/admin', adminRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/coupons', couponRouter);

app.get('/', (req, res) => {
    res.send('Welcome to the Multi-Vendor E-Commerce Platform API');
});

app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
})
