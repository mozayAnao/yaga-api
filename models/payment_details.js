const mongoose = require('mongoose');

const Payment = mongoose.model(
  'Payment',
  new mongoose.Schema({
    orderId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentType: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'complete'],
      required: true,
    },
  })
);

module.Payment = Payment;
