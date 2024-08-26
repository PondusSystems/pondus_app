const router = require("express").Router();
const controller = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const productSchemas = require('../schemas/productSchemas');
const validationMiddleware = require('../middleware/validationMiddleware');

router.get(
    "/fetch-all-products",
    authMiddleware.authenticateRequest,
    authMiddleware.verifyRole(['user', 'admin']),
    controller.FetchAllProducts
);

router.post(
    "/add-product",
    authMiddleware.authenticateRequest,
    authMiddleware.verifyRole(['admin']),
    validationMiddleware.validateRequest(productSchemas.productSchema),
    controller.AddProduct
);

router.patch(
    "/update-product/:productId",
    authMiddleware.authenticateRequest,
    authMiddleware.verifyRole(['admin']),
    validationMiddleware.validateParams(productSchemas.productIdSchema),
    validationMiddleware.validateRequest(productSchemas.productSchema),
    controller.UpdateProduct
);

router.delete(
    "/delete-product/:productId",
    authMiddleware.authenticateRequest,
    authMiddleware.verifyRole(['admin']),
    validationMiddleware.validateParams(productSchemas.productIdSchema),
    controller.DeleteProduct
);

module.exports = router;
