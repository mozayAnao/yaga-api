var express = require('express');
var router = express.Router();
const Joi = require('joi');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Customer, validateCustomer } = require('../models/customer');

/* GET users listing. */
router.get('/', [auth, admin], async (req, res) => {
  const customers = await Customer.find();

  let result = [];

  customers.forEach((customer) => {
    result.push(
      _.pick(customer, [
        '_id',
        'fname',
        'lname',
        'email',
        'verifiedEmail',
        'phone',
      ])
    );
  });

  res.send(result);
});

router.get('/me', auth, async (req, res) => {
  const customer = await Customer.findById(req.user._id).select('-password');

  res.send(customer);
});

router.post('/', validateCustomer, async (req, res) => {
  let customer = await Customer.findOne({ email: req.body.email });
  if (customer) return res.status(400).send('Customer already exists');

  customer = new Customer(
    _.pick(req.body, [
      'fname',
      'lname',
      'email',
      'phone',
      'password',
      'address.country',
      'address.city',
      'address.street',
    ])
  );
  const salt = await bcrypt.genSalt(10);
  customer.password = await bcrypt.hash(customer.password, salt);
  customer = await customer.save();

  const token = customer.generateCustomerAuthToken();

  res
    .header('x-auth-token', token)
    .send(
      _.pick(customer, [
        '_id',
        'fname',
        'lname',
        'email',
        'verifiedEmail',
        'phone',
        'address',
      ])
    );
});

router.put('/me', auth, validateCustomer, async (req, res) => {
  const customer = await Customer.findByIdAndUpdate(
    req.user._id,
    _.pick(req.body, ['fname', 'lname', 'email', 'phone', 'password']),
    { new: true }
  );

  if (!customer)
    return res
      .status(404)
      .send('The customer with the given ID does not exist');

  res.send(
    _.pick(customer, [
      '_id',
      'fname',
      'lname',
      'email',
      'verifiedEmail',
      'phone',
      'address',
    ])
  );
});

router.delete('/me', auth, async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.user._id);

  if (!customer)
    return res
      .status(404)
      .send('The customer with the given ID does not exist');

  res.send(
    _.pick(customer, [
      '_id',
      'fname',
      'lname',
      'email',
      'verifiedEmail',
      'phone',
    ])
  );
});

module.exports = router;
