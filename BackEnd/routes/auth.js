const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

router.post('/register', async (req, res, next) => {
  const { name, email, password, universityID } = req.body;

  try {
    if (!email.endsWith('@szabist.pk')) {
      return res.status(400).json({ msg: 'Registration limited to SZABIST email addresses only' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ name, email, password, universityID });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = { user: { id: user.id } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = { user: { id: user.id } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    next(err);
  }
});

router.get('/profile', auth, async (req, res) => {
    try {
        const User = require('../models/User');
        const Ride = require('../models/Ride');
        const Booking = require('../models/Booking');

        const user = await User.findById(req.user.id).select('-password');

        const ridesGiven = await Ride.countDocuments({ driver: req.user.id });

        const ridesTaken = await Booking.countDocuments({ passenger: req.user.id });

        const driverRides = await Ride.find({ driver: req.user.id });
        const driverRideIds = driverRides.map(r => r._id);

        const ratedBookings = await Booking.find({ 
            ride: { $in: driverRideIds }, 
            status: 'Completed', 
            rating: { $gt: 0 } 
        });

        let ratingDisplay = 'New';
        if (ratedBookings.length > 0) {
            const totalStars = ratedBookings.reduce((acc, b) => acc + b.rating, 0);
            const maxScore = ratedBookings.length * 5;
            ratingDisplay = Math.round((totalStars / maxScore) * 100) + '%';
        }

        res.json({
            user,
            stats: {
                ridesGiven,
                ridesTaken,
                rating: ratingDisplay
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;