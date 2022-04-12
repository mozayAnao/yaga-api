const mongoose = require('mongoose');
const Joi = require('joi');

const Service = mongoose.model(
  'Service',
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
    thumbnailUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      min: 5,
      max: 1024,
      required: true,
    },
    backgroundPhoto: {
      type: String,
      required: true,
      unique: true,
    },
  })
);

const validateService = async (req, res, next) => {
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
      .max(8)
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

    thumbnailUrl: Joi.string().required(),

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

    backgroundPhoto: Joi.string().required(),
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

exports.Service = Service;
exports.validateService = validateService;
