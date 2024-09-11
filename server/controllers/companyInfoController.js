const companyInfoService = require('../services/companyInfoService');

const FetchCompanyInfo = async (req, res, next) => {
  try {
    const companyInfo = await companyInfoService.fetchCompanyInfo(req.dbConnectionId);
    res.status(200).json({ companyInfo });
  } catch (error) {
    next(error);
  }
};

const UpdateCompanyInfo = async (req, res, next) => {
  try {
    const data = req.body;
    await companyInfoService.updateCompanyInfo(req.dbConnectionId, data);
    res.status(200).json({ message: "Company Info updated successfully!" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  FetchCompanyInfo,
  UpdateCompanyInfo
};
