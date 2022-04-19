const mongoose = require('mongoose');
const Joi = require('joi');

const Product = mongoose.model(
  'Product',
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
    },
    slug: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
      unique: true,
    },
    description: {
      type: String,
      min: 5,
      max: 1024,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    vendorId: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    reviews: [
      {
        review: String,
        date: {
          type: Date,
          Default: Date.now,
        },
      },
    ],
    ratings: [Number],
  })
);

const validateProduct = async (req, res, next) => {
  const data = req.body;

  const schema = Joi.object().keys({
    name: Joi.string()
      .min(3)
      .max(20)
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          switch (err.code) {
            case 'any.empty':
              err.message = 'Name should not be empty!';
              break;
            case 'string.min':
              err.message = `Name should have at least ${err.local.limit} characters!`;
              break;
            case 'string.max':
              err.message = `Name should have at most ${err.local.limit} characters!`;
              break;
            default:
              break;
          }
        });
        return errors;
      }),

    slug: Joi.string()
      .min(3)
      .max(20)
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          switch (err.code) {
            case 'any.empty':
              err.message = 'Slug should not be empty!';
              break;
            case 'string.min':
              err.message = `Slug should have at least ${err.local.limit} characters!`;
              break;
            case 'string.max':
              err.message = `Slug should have at most ${err.local.limit} characters!`;
              break;
            default:
              break;
          }
        });
        return errors;
      }),

    description: Joi.string()
      .min(3)
      .max(255)
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          switch (err.code) {
            case 'any.empty':
              err.message = 'Description should not be empty!';
              break;
            case 'string.min':
              err.message = `Description should have at least ${err.local.limit} characters!`;
              break;
            case 'string.max':
              err.message = `Description should have at most ${err.local.limit} characters!`;
              break;
            default:
              break;
          }
        });
        return errors;
      }),

    photo: Joi.string().required(),

    vendorId: Joi.string().required(),

    stock: Joi.number().required(),

    reviews: Joi.array({
      review: Joi.string(),
      date: Joi.date().default(Date.now),
    }),

    ratings: Joi.array(Joi.number()),
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

exports.Product = Product;
exports.validateProduct = validateProduct;
