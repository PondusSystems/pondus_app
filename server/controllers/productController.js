const productService = require('../services/productService');
const stripeService = require('../services/stripeService');

const FetchAllProducts = async (req, res, next) => {
    try {
        const ProductsFromDB = await productService.fetchAllProducts();
        const detailedProducts = await Promise.all(ProductsFromDB.map(async (product) => {
            const stripeInfo = await stripeService.fetchProductInfo(product.productId);
            return { ...stripeInfo, _id: product._id };
        }));
        res.status(200).json({ products: detailedProducts });
    } catch (error) {
        next(error);
    }
};

const AddProduct = async (req, res, next) => {
    try {
        const data = req.body;
        const productInfo = await stripeService.fetchProductInfo(data.productId);
        await productService.addProduct(data);
        res.status(200).json({ message: "Product added successfully!" });
    } catch (error) {
        next(error);
    }
};

const UpdateProduct = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const data = req.body;
        const productInfo = await stripeService.fetchProductInfo(data.productId);
        await productService.updateProduct(productId, data);
        res.status(200).json({ message: "Product updated successfully!" });
    } catch (error) {
        next(error);
    }
};

const DeleteProduct = async (req, res, next) => {
    try {
        const { productId } = req.params;
        await productService.deleteProduct(productId);
        res.status(200).json({ message: "Product deleted successfully!" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    FetchAllProducts,
    AddProduct,
    UpdateProduct,
    DeleteProduct
};
