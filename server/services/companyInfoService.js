const CompanyInfo = require('../models/companyInfoModel');

const fetchCompanyInfo = async () => {
    const companyInfoProjection = {
        name: 1,
        address: 1,
        city: 1,
        zip: 1,
        type: 1,
        logo: 1,
        _id: 0
    };
    const companyInfo = await CompanyInfo.findOne({}, companyInfoProjection);
    if (!companyInfo) {
        const error = new Error('Company Info not found!');
        error.code = 404;
        throw error;
    }
    return companyInfo;
};

const updateCompanyInfo = async (updateData) => {
    const updatedInfo = await CompanyInfo.findOneAndUpdate({}, updateData, { new: true });
    if (!updatedInfo) {
        const error = new Error('Company Info not found!');
        error.code = 404;
        throw error;
    }
    return updatedInfo;
};

const test = async () => {
    const info = await fetchCompanyInfo();
    console.log('Info: ', info);
}

// test()

module.exports = {
    fetchCompanyInfo,
    updateCompanyInfo
};
