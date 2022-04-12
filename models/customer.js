const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const customerSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  lname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    unique: true,
  },
  verifiedEmail: {
    type: Boolean,
    required: true,
    default: false,
  },
  phone: {
    type: Number,
    required: true,
    minlength: 10,
    maxlength: 15,
  },
  password: {
    type: String,
    min: 5,
    max: 1024,
    required: true,
  },
  address: {
    country: {
      type: String,
      default: 'Ghana',
    },
    city: {
      type: String,
    },
    street: {
      type: String,
    },
  },
});

customerSchema.methods.generateCustomerAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      thisname: this.fname,
      email: this.email,
      verifiedEmail: this.verifiedEmail,
      city: this.address.city,
    },
    config.get('jwtPrivateKey')
  );

  return token;
};

const Customer = mongoose.model('Customer', customerSchema);

const validateCustomer = async (req, res, next) => {
  const data = req.body;

  const schema = Joi.object().keys({
    fname: Joi.string()
      .min(3)
      .max(50)
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          switch (err.code) {
            case 'any.empty':
              err.message = 'First name should not be empty!';
              break;
            case 'string.min':
              err.message = `First name should have at least ${err.local.limit} characters!`;
              break;
            case 'string.max':
              err.message = `First name should have at most ${err.local.limit} characters!`;
              break;
            default:
              break;
          }
        });
        return errors;
      }),

    lname: Joi.string()
      .min(3)
      .max(50)
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          switch (err.code) {
            case 'any.empty':
              err.message = 'Last name should not be empty!';
              break;
            case 'string.min':
              err.message = `Last name should have at least ${err.local.limit} characters!`;
              break;
            case 'string.max':
              err.message = `Last name should have at most ${err.local.limit} characters!`;
              break;
            default:
              break;
          }
        });
        return errors;
      }),

    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org'] } })
      .min(5)
      .max(255)
      .required(),

    phone: Joi.number().required(),

    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
      .min(5)
      .max(255)
      .required(),

    address: Joi.object({
      country: Joi.string().default('Ghana'),
      city: Joi.string(),
      street: Joi.string(),
    }),
  });

  try {
    const value = await schema.validateAsync(data);
    console.log(value);
    next();
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: err.details[0].message });
  }
};

exports.Customer = Customer;
exports.validateCustomer = validateCustomer;
