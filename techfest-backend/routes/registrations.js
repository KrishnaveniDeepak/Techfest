const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

// Create Registration & Decrement Seats in MongoDB
router.post('/', auth, async (req, res) => {
  const { eventId, fullName, department, dob, mobileNumber } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.seats <= 0) {
      return res.status(400).json({ message: 'No seats available for this event' });
    }

    // 1. Create registration entry
    const registration = new Registration({
      user: req.user.id,
      event: eventId,
      fullName,
      department,
      dob,
      mobileNumber
    });
    await registration.save();

    // 2. Decrement available seats by 1
    event.seats -= 1;
    await event.save();

    res.json({ registration, remainingSeats: event.seats });
  } catch (err) {
    res.status(500).json({ message: 'Server error saving registration' });
  }
});

// Fetch User Registrations
router.get('/', auth, async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user.id }).populate('event');
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching registrations' });
  }
});

// Update Registration Entry
router.put('/:id', auth, async (req, res) => {
  const { eventId, fullName, department, dob, mobileNumber } = req.body;
  try {
    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { event: eventId, fullName, department, dob, mobileNumber },
      { new: true }
    ).populate('event');
    res.json(registration);
  } catch (err) {
    res.status(500).json({ message: 'Server error updating registration' });
  }
});

// Delete Registration & Restore Seat Count
router.delete('/:id', auth, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (registration) {
      // Restore 1 seat back in MongoDB
      await Event.findByIdAndUpdate(registration.event, { $inc: { seats: 1 } });
      await Registration.findByIdAndDelete(req.params.id);
    }
    res.json({ message: 'Registration deleted and seat restored' });
  } catch (err) {
    res.status(500).json({ message: 'Server error deleting registration' });
  }
});

module.exports = router;