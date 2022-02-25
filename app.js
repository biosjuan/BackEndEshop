const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');

require('dotenv/config');

const api = process.env.API_URL;

//Middleware
app.use(express.json());
app.use(morgan('tiny'));

const productSchema = mongoose.Schema({
    name: String,
    image: String,
    countInStock: {
        type: Number,
        required: true
    }
})

const Product = mongoose.model('Product', productSchema);

app.get(`${api}/products`, async (req, res) => {
    const productList = await Product.find();
    if (!productList) {
        res.status(500).json({success: false});
    }
    res.send(productList);
})

app.post(`${api}/products`, (req, res) => {
    const product = new Product({
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock
    })

    product.save().then((createdProcut) => {
        res.status(201).json(createdProcut)
    }).catch((err) => {
        res.status(500).json({
            err: err,
            success: false
        })
    })
})

mongoose.connect(process.env.CONNECTION_STRING).then(() => {
    console.log('Database Connection ready');
}).catch(err => console.log(err))

app.listen(3000, () => {
    console.log('server is running http://localhost:3000')
})