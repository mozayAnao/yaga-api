const mongoose = require('mongoose');

const Cart = mongoose.model(
  'Cart',
  new mongoose.Schema({
    customerId: {
      type: String,
      required: trusted,
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
  })
);

module.Cart = Cart;
