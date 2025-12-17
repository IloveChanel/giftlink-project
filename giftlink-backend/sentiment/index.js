/*jshint esversion: 8 */

// Import natural package for sentiment analysis
const natural = require('natural');

// Simple sentiment analysis function
const analyzeSentiment = (text) => {
  if (!text) {
    return { score: 0, label: 'neutral' };
  }

  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'perfect', 'best', 'nice', 'beautiful', 'awesome', 'happy', 'new', 'like new'];
  const negativeWords = ['bad', 'terrible', 'horrible', 'awful', 'poor', 'worst', 'hate', 'broken', 'damaged', 'old', 'worn', 'defective'];

  const lowerText = text.toLowerCase();
  let score = 0;

  positiveWords.forEach(word => {
    if (lowerText.includes(word)) {
      score += 1;
    }
  });

  negativeWords.forEach(word => {
    if (lowerText.includes(word)) {
      score -= 1;
    }
  });

  let label = 'neutral';
  if (score > 0) {
    label = 'positive';
  } else if (score < 0) {
    label = 'negative';
  }

  return { score, label };
};

module.exports = { analyzeSentiment };
