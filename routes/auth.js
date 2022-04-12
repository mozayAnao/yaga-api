var express = require('express');
var router = express.Router();
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validateAuth = require('../middleware/validator');
const { User } = require('../models/user');
const { Customer } = require('../models/customer');
const config = require('config');

router.post('/admin', validateAuth, async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password');

  const token = user.generateAuthToken();

  res.send(token);
});

router.post('/customer', validateAuth, async (req, res) => {
  let customer = await Customer.findOne({ email: req.body.email });
  if (!customer) return res.status(400).send('Invalid email or password');

  const validPassword = await bcrypt.compare(
    req.body.password,
    customer.password
  );
  if (!validPassword) return res.status(400).send('Invalid email or password');

  const token = customer.generateCustomerAuthToken();

  res.send(token);
});
module.exports = router;
