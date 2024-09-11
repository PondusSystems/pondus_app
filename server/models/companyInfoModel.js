const mongoose = require("mongoose");

const companyInfoSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        address: {
            type: String,
            required: true,
            trim: true
        },
        city: {
            type: String,
            required: true,
            trim: true
        },
        zip: {
            type: String,
            required: true,
            trim: true
        },
        type: {
            type: String,
            required: true,
            enum: ['Studio', 'Traditional Gym', 'Health Club', 'Non-profit', 'Other']
        },
        logo: {
            type: String,
            default: null
        }
    },
    { timestamps: true }
);

// const CompanyInfo = mongoose.model("company-info", companyInfoSchema);

module.exports = companyInfoSchema;
