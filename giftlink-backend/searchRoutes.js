/*jshint esversion: 8 */

const express = require('express');
const router = express.Router();
const Gift = require('./models/Gift');

// Search endpoint
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    const category = req.query.category;
    const condition = req.query.condition;
    
    let searchQuery = {};
    
    // Text search
    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ];
    }
    
    // Filter by category
    if (category) {
      searchQuery.category = category;
    }
    
    // Filter by condition
    if (condition) {
      searchQuery.condition = condition;
    }
    
    const results = await Gift.find(searchQuery).sort({ datePosted: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
