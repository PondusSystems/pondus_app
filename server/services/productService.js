const Product = require('../models/productModel');

const fetchAllProducts = async () => {
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

const addProduct = async (data) => {
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

const updateProduct = async (productId, data) => {
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

const deleteProduct = async (productId) => {
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

const test = async () => {
    // await addProduct({ productId: "12345678901234" });
    // const products = await fetchAllProducts()
    // console.log('Products: ', products);
    const productId = '66c465fbc265ac0506b00982';
    // await updateProduct(productId, { productId: 'abcd' });
    await deleteProduct(productId);
}

// test();

module.exports = {
    fetchAllProducts,
    addProduct,
    updateProduct,
    deleteProduct
};
