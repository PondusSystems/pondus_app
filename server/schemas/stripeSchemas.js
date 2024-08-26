const yup = require('yup');

const createCheckoutSchema = yup.object().shape({
    priceId: yup.string().trim().required('Product Id is required'),
});


module.exports = {
    createCheckoutSchema,
}