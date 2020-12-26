const express = require('express'),
	app = express(),
	path = require('path'),
	port = process.env.PORT || 3000,
	mongoose = require('mongoose'),
	Product = require('./models/ProductSchema'),
	methodOverride = require('method-override'),
	categories = ['fruit', 'vegetable', 'dairy'];

require('dotenv').config();
mongoose
	.connect(process.env.DB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(() => {
		console.log('connection open');
	})
	.catch((e) => {
		console.log('connection error');
	});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
	res.redirect('/products');
});
app.get('/products', async (req, res) => {
	const { category } = req.query;
	if (category) {
		const products = await Product.find({ category });
		res.render('products/index', { products, category: `"${category}"` });
	} else {
		const products = await Product.find({});
		res.render('products/index', { products, category: 'All' });
	}
});

app.get('/products/new', (req, res) => {
	res.render('products/new', { categories });
});

app.get('/products/:id/edit', async (req, res) => {
	const { id } = req.params;
	const product = await Product.findById(id);
	res.render('products/edit', { product, categories });
});

app.put('/products/:id', async (req, res) => {
	const { id } = req.params;
	const product = await Product.findByIdAndUpdate(id, req.body, {
		runValidators: true,
		new: true,
		useFindAndModify: false,
	});
	res.redirect(`/products/${product._id}`);
});
app.get('/products/:id', async (req, res) => {
	const { id } = req.params;
	try {
		const product = await Product.findById(id);
		res.render('products/details', { product });
	} catch (e) {
		console.log('error with id');
	}
});

app.post('/products', async (req, res) => {
	try {
		const newProduct = new Product(req.body);
		await newProduct.save();
		res.redirect(`/products/${newProduct._id}`);
	} catch (e) {
		console.log('error creating product');
	}
});

app.delete('/products/:id', async (req, res) => {
	const { id } = req.params;
	await Product.findByIdAndDelete(id);
	res.redirect('/products');
});
app.listen(port, () => {
	console.log(`Listening on port : ${port}`);
});
