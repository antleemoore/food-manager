const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
		min: 0,
	},
	category: {
		type: String,
		enum: ['fruit', 'vegetable', 'dairy'],
		lowercase: true,
	},
	expire_at: {
		type: Date,
		default: Date.now,
		expires: 600,
	},
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
