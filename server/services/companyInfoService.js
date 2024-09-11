const { loadDBModel } = require('../utils/modelUtils');

const fetchCompanyInfo = async (connectionId) => {
    const CompanyInfo = loadDBModel(connectionId, 'company-info');
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

const updateCompanyInfo = async (connectionId, updateData) => {
    const CompanyInfo = loadDBModel(connectionId, 'company-info');
    const updatedInfo = await CompanyInfo.findOneAndUpdate({}, updateData, { new: true });
    if (!updatedInfo) {
        const error = new Error('Company Info not found!');
        error.code = 404;
        throw error;
    }
    return updatedInfo;
};

module.exports = {
    fetchCompanyInfo,
    updateCompanyInfo
};
