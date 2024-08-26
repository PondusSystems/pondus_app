const yup = require('yup');
const mongoose = require('mongoose');

const ObjectId = yup.string().test('is-valid', 'Invalid product ID', value => mongoose.Types.ObjectId.isValid(value));

const productSchema = yup.object().shape({
    productId: yup.string().trim().required('Product Id is required'),
});

const productIdSchema = yup.object().shape({
    productId: ObjectId.required('Product ID is required'),
});

module.exports = {
    productSchema,
    productIdSchema
}