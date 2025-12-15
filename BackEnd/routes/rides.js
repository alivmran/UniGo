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

router.get('/', async (req, res) => {
    try {
        const rides = await Ride.find().populate('driver', 'name').sort({ date: 1 });
        const Booking = require('../models/Booking');

        const ridesWithRating = await Promise.all(rides.map(async (ride) => {
            if (!ride.driver) {
                return { ...ride._doc, driverName: 'Unknown', driverRating: 'New' };
            }

            const driverBookings = await Booking.find({ 
                driver: ride.driver._id, 
                status: 'Completed', 
                rating: { $gt: 0 } 
            });

            let ratingDisplay = 'New';

            if (driverBookings.length > 0) {
                const totalStars = driverBookings.reduce((acc, b) => acc + b.rating, 0);
                const maxPossibleScore = driverBookings.length * 5;
                const percentage = Math.round((totalStars / maxPossibleScore) * 100);
                ratingDisplay = `${percentage}%`; 
            }

            return {
                ...ride._doc,
                driverName: ride.driver.name,
                driverRating: ratingDisplay
            };
        }));

        res.json(ridesWithRating);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
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

    const Booking = require('../models/Booking'); 
    await Booking.deleteMany({ ride: req.params.id });

    await ride.deleteOne();
    
    res.json({ msg: 'Ride and associated bookings removed' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;