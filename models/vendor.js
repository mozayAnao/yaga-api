const mongoose = require('mongoose');
const Joi = require('joi');

const Vendor = mongoose.model(
  'Vendor',
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
      gpsCoordinates: {
        type: String,
      },
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
    serviceId: {
      type: String,
      required: true,
    },
    ownerId: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
  })
);

const validateVendor = async (req, res, next) => {
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

    address: Joi.object({
      country: Joi.string().default('Ghana'),
      city: Joi.string(),
      street: Joi.string(),
      gpsCoordinates: Joi.string(),
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

    serviceId: Joi.string().required(),

    ownerId: Joi.string().required(),

    phone: Joi.number().required(),
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

exports.Vendor = Vendor;
exports.validateVendor = validateVendor;
