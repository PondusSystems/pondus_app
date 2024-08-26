const router = require("express").Router();
const controller = require("../controllers/companyInfoController");
const authMiddleware = require("../middleware/authMiddleware");
const companyInfoSchemas = require('../schemas/companyInfoSchemas');
const validationMiddleware = require('../middleware/validationMiddleware');

router.get(
    "/fetch-company-info",
    controller.FetchCompanyInfo
);

router.patch(
    "/update-company-info",
    authMiddleware.authenticateRequest,
    authMiddleware.verifyRole(['admin']),
    validationMiddleware.validateRequest(companyInfoSchemas.updateCompanyInfoSchema),
    controller.UpdateCompanyInfo
);

module.exports = router;
