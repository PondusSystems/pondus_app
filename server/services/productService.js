const { loadDBModel } = require('../utils/modelUtils');

const fetchAllProducts = async (connectionId) => {
    const Product = loadDBModel(connectionId, 'product');
    const product = await Product.findOne({});
    if (!product) {
        const error = new Error('Product collection not found!');
        error.code = 404;
        throw error;
    }
    const { products } = product;
    if (!products && products.length <= 0) {
        const error = new Error('Products not found!');
        error.code = 404;
        throw error;
    }
    return products;
};

const addProduct = async (connectionId, data) => {
    const Product = loadDBModel(connectionId, 'product');
    let product = await Product.findOne({});
    if (!product) {
        product = await Product.create({
            products: [data]
        });
    }
    else {
        const existingProduct = product.products.find(item => item.productId === data.productId);
        if (existingProduct) {
            const error = new Error('Product already exist!');
            error.code = 400;
            throw error;
        }
        product.products.push(data);
    }
    await product.save();
};

const updateProduct = async (connectionId, productId, data) => {
    const Product = loadDBModel(connectionId, 'product');
    const product = await Product.findOne({});
    if (!product) {
        const error = new Error('Product collection not found!');
        error.code = 404;
        throw error;
    }

    const existingProduct = product.products.find(item => item._id.toString() === productId);
    if (!existingProduct) {
        const error = new Error('Product does not exist!');
        error.code = 404;
        throw error;
    }

    Object.assign(existingProduct, data);

    await product.save();
};

const deleteProduct = async (connectionId, productId) => {
    const Product = loadDBModel(connectionId, 'product');
    const product = await Product.findOne({});
    if (!product) {
        const error = new Error('Product collection not found!');
        error.code = 404;
        throw error;
    }

    const productIndex = product.products.findIndex(item => item._id.toString() === productId);
    if (productIndex === -1) {
        const error = new Error('Product does not exist!');
        error.code = 404;
        throw error;
    }

    product.products.splice(productIndex, 1);

    await product.save();
};


module.exports = {
    fetchAllProducts,
    addProduct,
    updateProduct,
    deleteProduct
};
