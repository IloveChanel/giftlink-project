/*jshint esversion: 8 */

const express = require('express');
const router = express.Router();

// Search endpoint
router.get('/search', (req, res) => {
  const query = req.query.q;
  
  if (!query) {
    return res.status(400).json({ message: 'Search query required' });
  }
  
  // Sample search logic
  const results = [
    { id: 1, name: 'Gift Card', price: 50 },
    { id: 2, name: 'Book', price: 20 }
  ].filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
  
  res.json(results);
});

module.exports = router;
