const mongoose = require('mongoose');
const Joi = require('joi');

const Category = mongoose.model(
  'Category',
  new mongoose.Schema({
    name: {
      type: String,
      min: 3,
      max: 50,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      unique: true,
    },
    description: {
      type: String,
      min: 10,
      max: 255,
    },
    serviceId: {
      type: String,
      required: true,
    },
  })
);

const validateCategory = async (req, res, next) => {
  const data = req.body;

  const schema = Joi.object().keys({
    name: Joi.string()
      .min(3)
      .max(50)
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
      .max(50)
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
      .min(10)
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

    serviceId: Joi.string().required(),
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

module.validateCategory = validateCategory;
module.Category = Category;
