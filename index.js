import express from 'express'
import 'dotenv/config'
import authUserRouter from './routes/authUserRouter.js'
import vendorRouter from './routes/vendorRouter.js'
import productRouter from './routes/productRouter.js'
import categoryRouter from './routes/categoryRouter.js'
import cartRouter from './routes/cartRouter.js'
import orderRouter from './routes/orderRouter.js'
import adminRouter from './routes/adminRouter.js'
import passport from './middleware/passportMiddleware.js'

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());


app.use(passport.initialize());

app.use('/api/auth', authUserRouter);
app.use('/api/vendor', vendorRouter);
app.use('/api/vendor', productRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);
app.use('/api/admin', adminRouter);

app.get('/', (req, res) => {
    res.send('Welcome to the Multi-Vendor E-Commerce Platform API');
});

app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
})