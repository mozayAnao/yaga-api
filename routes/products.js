const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const _ = require('lodash');
const auth = require('../middleware/auth');
const vendor = require('../middleware/vendor');

router.get('/', async (req, res) => {
  const products = await Product.find();

  res.send(products);
});

router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product)
    return res.status(404).send('The product with the given ID does not exist');

  res.send(product);
});

router.post('/', [auth, vendor], async (req, res) => {
  const product = new Product(
    _.pick(req.body, [
      'name',
      'slug',
      'description',
      'photo',
      'vendorId',
      'stock',
    ])
  );

  product = await product.save();

  res.send(product);
});

router.put('/:id', [auth, vendor], async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    _.pick(req.body, [
      'name',
      'slug',
      'description',
      'photo',
      'vendorId',
      'stock',
    ]),
    { new: true }
  );

  if (!product)
    return res
      .status(404)
      .send('The product with the given ID does not exsist');

  res.send(product);
});

router.put('/reviews/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product)
    return res
      .status(404)
      .send('The product with the given ID does not exsist');

  product.reviews.push(req.body);

  product = product.save();

  res.send(product);
});

router.put('/ratings/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product)
    return res
      .status(404)
      .send('The product with the given ID does not exsist');

  product.ratings.push(req.body.rating);

  product = product.save();

  res.send(product);
});

router.delete('/:id', [auth, vendor], async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params.id);

  if (!product)
    return res.status(404).send('The product with the given ID does not exist');

  res.send(product);
});

module.exports = router;
