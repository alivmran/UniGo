const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Ride = require('../models/Ride');

router.post('/', auth, async (req, res, next) => {
  const { origin, destination, date, time, seatsAvailable, price } = req.body;

  try {
    const newRide = new Ride({
      driver: req.user.id,
      origin,
      destination,
      date,
      time,
      seatsAvailable,
      price
    });

    const ride = await newRide.save();
    res.json(ride);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { origin, destination } = req.query;
    let query = {};
    
    if (origin) {
        query.origin = { $regex: origin, $options: 'i' };
    }
    if (destination) {
        query.destination = { $regex: destination, $options: 'i' };
    }

    const rides = await Ride.find(query).sort({ date: -1 });
    res.json(rides);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', auth, async (req, res, next) => {
  const { origin, destination, date, time, seatsAvailable, price } = req.body;

  try {
    let ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ msg: 'Ride not found' });
    }

    if (ride.driver.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized to update this ride' });
    }

    ride.origin = origin || ride.origin;
    ride.destination = destination || ride.destination;
    ride.date = date || ride.date;
    ride.time = time || ride.time;
    ride.seatsAvailable = seatsAvailable || ride.seatsAvailable;
    ride.price = price || ride.price;

    await ride.save();
    res.json(ride);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', auth, async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ msg: 'Ride not found' });
    }

    if (ride.driver.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized to delete this ride' });
    }

    await ride.deleteOne();
    res.json({ msg: 'Ride removed' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;