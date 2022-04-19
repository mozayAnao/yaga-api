const mongoose = require('mongoose');

const Order = mongoose.model(
  'Order',
  new mongoose.Schema({
    customerId: {
      type: String,
      required: true,
    },
    vendorId: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    items: [
      {
        productId: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    paymentId: {
      type: String,
      required: true,
    },
    courierId: {
      type: String,
      required: true,
    },
  })
);

module.Order = Order;
