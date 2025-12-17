/*jshint esversion: 8 */

const express = require('express');
const router = express.Router();
const Gift = require('./models/Gift');
const { authenticate } = require('./auth');
const { analyzeSentiment } = require('./sentiment');

// Get all gifts
router.get('/gifts', async (req, res) => {
  try {
    const gifts = await Gift.find().sort({ datePosted: -1 });
    res.json(gifts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get gift by ID
router.get('/gifts/:id', async (req, res) => {
  try {
    const gift = await Gift.findById(req.params.id);
    if (!gift) {
      return res.status(404).json({ message: 'Gift not found' });
    }
    
    // Add sentiment analysis
    const sentiment = analyzeSentiment(gift.description);
    res.json({ ...gift.toObject(), sentiment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new gift (requires authentication)
router.post('/gifts', authenticate, async (req, res) => {
  try {
    const { name, description, category, condition, age, imageUrl } = req.body;
    
    const gift = new Gift({
      name,
      description,
      category,
      condition,
      age,
      imageUrl,
      userId: req.user.id,
      userName: `${req.user.firstName} ${req.user.lastName}`
    });
    
    const savedGift = await gift.save();
    res.status(201).json(savedGift);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update gift
router.put('/gifts/:id', authenticate, async (req, res) => {
  try {
    const gift = await Gift.findById(req.params.id);
    
    if (!gift) {
      return res.status(404).json({ message: 'Gift not found' });
    }
    
    // Check if user owns the gift
    if (gift.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this gift' });
    }
    
    const updatedGift = await Gift.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedGift);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete gift
router.delete('/gifts/:id', authenticate, async (req, res) => {
  try {
    const gift = await Gift.findById(req.params.id);
    
    if (!gift) {
      return res.status(404).json({ message: 'Gift not found' });
    }
    
    // Check if user owns the gift
    if (gift.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this gift' });
    }
    
    await Gift.findByIdAndDelete(req.params.id);
    res.json({ message: 'Gift deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
