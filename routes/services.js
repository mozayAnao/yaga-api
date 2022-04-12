const express = require('express');
const router = express.Router();
const _ = require('lodash');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Service, validateService } = require('../models/service');

router.get('/', async (req, res) => {
  const services = await Service.find();

  res.send(services);
});

router.get('/:id', async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service)
    return res.status(404).send('The service with the given ID does not exist');

  res.send(service);
});

router.post('/', [auth, admin], validateService, async (req, res) => {
  let service = await Service.findOne({ slug: req.body.slug });
  if (service) return res.status(400).send('This service already exists');

  service = new Service(
    _.pick(req.body, [
      'name',
      'slug',
      'thumbnailUrl',
      'description',
      'backgroundPhoto',
    ])
  );

  service = await service.save();

  res.send(service);
});

router.put('/:id', [auth, admin], validateService, async (req, res) => {
  const service = await Service.findByIdAndUpdate(
    req.params.id,
    _.pick(req.body, [
      'name',
      'slug',
      'thumbnailUrl',
      'description',
      'backgroundPhoto',
    ]),
    { new: true }
  );

  if (!service)
    return res.status(404).send('The Sercive with the given ID does not exist');

  res.send(service);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const service = await Service.findByIdAndRemove(req.params.id);

  if (!service)
    return res.status(404).send('The service with the given ID does not exist');

  res.send(service);
});

module.exports = router;
