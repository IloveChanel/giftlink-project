/*jshint esversion: 8 */

const express = require('express');
const router = express.Router();

// Sample gift data
let gifts = [
  { id: 1, name: 'Gift Card', price: 50 },
  { id: 2, name: 'Book', price: 20 }
];

// Get all gifts
router.get('/gifts', (req, res) => {
  res.json(gifts);
});

// Get gift by ID
router.get('/gifts/:id', (req, res) => {
  const gift = gifts.find(g => g.id === parseInt(req.params.id));
  if (!gift) {
    return res.status(404).json({ message: 'Gift not found' });
  }
  res.json(gift);
});

// Create new gift
router.post('/gifts', (req, res) => {
  const newGift = {
    id: gifts.length + 1,
    name: req.body.name,
    price: req.body.price
  };
  gifts.push(newGift);
  res.status(201).json(newGift);
});

module.exports = router;
