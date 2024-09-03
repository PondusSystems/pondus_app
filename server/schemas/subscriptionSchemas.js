const yup = require('yup');

const dashboardDataSchema = yup.object().shape({
    year: yup.string().trim().required('Year is required'),
    view: yup.string().trim().required('View is required'),
});

module.exports = {
    dashboardDataSchema,
}