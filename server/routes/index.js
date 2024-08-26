const express = require('express');
const UserRoutes = require('./userRoutes');
const CompanyInfoRoutes = require('./companyInfoRoutes');
const ProductRoutes = require('./productRoutes');
const StripeRoutes = require('./stripeRoutes');

const router = express.Router();

// Set up routes
router.use('/user', UserRoutes);
router.use('/company-info', CompanyInfoRoutes);
router.use('/product', ProductRoutes);
router.use('/stripe', StripeRoutes);

module.exports = router;