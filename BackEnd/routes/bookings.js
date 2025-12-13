const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');
const Ride = require('../models/Ride');

router.post('/', auth, async (req, res) => {
    const { rideId } = req.body;

    try {
        const ride = await Ride.findById(rideId);
        if (!ride) {
            return res.status(404).json({ msg: 'Ride not found' });
        }

        const existingBooking = await Booking.findOne({ 
            ride: rideId, 
            passenger: req.user.id 
        });

        if (existingBooking) {
            return res.status(400).json({ msg: 'You have already booked this ride' });
        }

        if (ride.seatsAvailable <= 0) {
            return res.status(400).json({ msg: 'No seats available' });
        }

        const newBooking = new Booking({
            passenger: req.user.id,
            ride: rideId,
            driver: ride.driver
        });

        await newBooking.save();

        res.json(newBooking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/my-bookings', auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ passenger: req.user.id })
            .populate('ride') 
            .sort({ date: -1 }); 
        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/incoming-requests', auth, async (req, res) => {
    try {
        const rides = await Ride.find({ driver: req.user.id });
        const rideIds = rides.map(ride => ride._id);

        const bookings = await Booking.find({ ride: { $in: rideIds } })
            .populate('ride')
            .populate('passenger', 'name email universityID')
            .sort({ _id: -1 }); 

        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/:id', auth, async (req, res) => {
    const { status } = req.body;

    try {
        let booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ msg: 'Booking not found' });
        }

        booking.status = status;
        await booking.save();

        if (status === 'Confirmed') {
            const ride = await Ride.findById(booking.ride);
            if (ride) {
                ride.seatsAvailable = ride.seatsAvailable - 1;
                await ride.save();
            }
        }

        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;