const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { Booking, CounselorAvailability } = require('../models/Booking');
const Counselor = require('../models/Counselor');

router.get('/', auth, async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('counselor', 'fullName specialization languages')
      .sort({ date: -1 });
    res.json({ bookings });
  } catch (err) { next(err); }
});

router.get('/counselor', auth, async (req, res, next) => {
  try {
    if (req.user.role !== 'counselor' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const counselor = await Counselor.findOne({ user: req.user._id });
    if (!counselor) return res.status(404).json({ message: 'Counselor profile not found' });
    const bookings = await Booking.find({ counselor: counselor._id })
      .populate('user', 'displayName email')
      .sort({ date: -1 });
    res.json({ bookings });
  } catch (err) { next(err); }
});

router.post('/', auth, async (req, res, next) => {
  try {
    const { counselorId, date, type, topic, notes } = req.body;
    const counselor = await Counselor.findById(counselorId);
    if (!counselor) return res.status(404).json({ message: 'Counselor not found' });

    const booking = await Booking.create({
      user: req.user._id,
      counselor: counselorId,
      date: new Date(date),
      type: type || 'chat',
      topic,
      notes,
      status: 'pending',
    });

    res.status(201).json({ booking });
  } catch (err) { next(err); }
});

router.patch('/:id/cancel', auth, async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    booking.status = 'cancelled';
    await booking.save();
    res.json({ booking });
  } catch (err) { next(err); }
});

router.patch('/:id/confirm', auth, async (req, res, next) => {
  try {
    if (req.user.role !== 'counselor' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    booking.status = 'confirmed';
    await booking.save();
    res.json({ booking });
  } catch (err) { next(err); }
});

router.get('/availability/:counselorId', auth, async (req, res, next) => {
  try {
    const slots = await CounselorAvailability.find({
      counselor: req.params.counselorId,
      active: true,
    }).sort({ dayOfWeek: 1, startTime: 1 });
    res.json({ slots });
  } catch (err) { next(err); }
});

module.exports = router;
