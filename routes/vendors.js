const express = require('express');
const router = express.Router();
const _ = require('lodash');
const auth = require('../middleware/auth');
const vendor = require('../middleware/vendor');
const { Vendor, validateVendor } = require('../models/vendor');

router.get('/', async (req, res) => {
  const vendors = await Vendor.find();

  res.send(vendors);
});

router.get('/:id', async (req, res) => {
  let vendor = await Vendor.findById(req.params.id);

  if (!vendor)
    return res.status(404).send('The vendor with the given ID does not exist');

  res.send(vendor);
});

router.post('/', [auth, vendor], validateVendor, async (req, res) => {
  let vendor = await Vendor.findOne(req.body.slug);
  if (vendor) return res.status(400).send('This vender already exists');

  vendor = new Vendor(
    _.pick(req.body, [
      'name',
      'slug',
      'address.country',
      'address.city',
      'address.gpsCoordinates',
      'description',
      'photo',
      'serviceId',
      'ownerId',
      'phone',
    ])
  );

  vendor = await vendor.save();

  res.send(vendor);
});

router.put('/:id', [auth, vendor], validateVendor, async (req, res) => {
  let vendor = await Vendor.findByIdAndUpdate(
    req.params.id,
    _.pick(req.body, [
      'name',
      'slug',
      'address.country',
      'address.city',
      'address.gpsCoordinates',
      'description',
      'photo',
      'serviceId',
      'ownerId',
      'phone',
    ]),
    { new: true }
  );

  if (!vendor)
    return res.status(404).send('The vendor with the given ID does not exist');

  res.send(vendor);
});

router.delete('/:id', [auth, vendor], async (req, res) => {
  let vendor = await Vendor.findByIdAndRemove(req.params.id);

  if (!vendor)
    return res.status(404).send('The vendor with the given ID does not exist');

  res.send(vendor);
});

module.exports = router;
