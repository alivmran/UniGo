const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');
const Ride = require('../models/Ride');

router.post('/', auth, async (req, res, next) => {
  const { rideId } = req.body;

  try {
    const newBooking = new Booking({
      ride: rideId,
      passenger: req.user.id,
      status: 'Requested'
    });

    const booking = await newBooking.save();
    res.json(booking);
  } catch (err) {
    next(err);
  }
});

router.get('/my-bookings', auth, async (req, res, next) => {
    try {
        const bookings = await Booking.find({ passenger: req.user.id }).populate('ride');
        res.json(bookings);
    } catch (err) {
        next(err);
    }
});

router.put('/:id', auth, async (req, res, next) => {
  const { status } = req.body;

  try {
    let booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ msg: 'Booking not found' });

    const oldStatus = booking.status;
    booking.status = status;
    await booking.save();

    if (status === 'Confirmed' && oldStatus !== 'Confirmed') {
      const ride = await Ride.findById(booking.ride);
      if (ride) {
        if (ride.seatsAvailable > 0) {
            ride.seatsAvailable = ride.seatsAvailable - 1;
            await ride.save();
        } else {
            return res.status(400).json({ msg: 'No seats available' });
        }
      }
    }

    res.json(booking);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', auth, async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    if (booking.passenger.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'Confirmed') {
        const ride = await Ride.findById(booking.ride);
        if (ride) {
            ride.seatsAvailable += 1;
            await ride.save();
        }
    }

    await booking.deleteOne();
    res.json({ msg: 'Booking cancelled' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;