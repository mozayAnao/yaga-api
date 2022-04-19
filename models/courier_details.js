const mongoose = require('mongoose');

const Courier = mongoose.model(
  'Courier',
  new mongoose.Schema({
    courierId: {
      type: String,
      required: true,
    },
    agency: {
      type: String,
      min: 3,
      max: 50,
      required: true,
    },
    affiliateVendor: {
      type: String,
    },
  })
);

module.Courier = Courier;
