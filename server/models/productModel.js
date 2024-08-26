const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        productId: {
            type: String,
            required: true,
            unique: true,
            trim: true
        }
    },
    {
        timestamps: true,
    }
);

const productsArraySchema = new mongoose.Schema({
    products: {
        type: [productSchema],
        default: []
    }
});

const Product = mongoose.model("product", productsArraySchema);

module.exports = Product;
