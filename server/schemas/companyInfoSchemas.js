const yup = require('yup');

const updateCompanyInfoSchema = yup.object().shape({
    name: yup.string().trim(),
    address: yup.string().trim(),
    city: yup.string().trim(),
    zip: yup.string().trim(),
    type: yup.string().trim(),
});

module.exports = {
    updateCompanyInfoSchema
}