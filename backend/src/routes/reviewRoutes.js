// routes/reviewRoutes.js

import express from 'express';
import Review from '../models/Review.js';

const router = express.Router();

// Create a new review
router.post('/', async (req, res) => {
  const review = await Review.create(req.body);
  res.status(201).json(review);
});

// Get a review by ID
router.get('/:id', async (req, res) => {
  const review = await Review.findByPk(req.params.id);
  res.json(review);
});

// Update a review by ID
router.put('/:id', async (req, res) => {
  const review = await Review.findByPk(req.params.id);
  await review.update(req.body);
  res.json(review);
});

// Delete a review by ID
router.delete('/:id', async (req, res) => {
  const review = await Review.findByPk(req.params.id);
  await review.destroy();
  res.json({ message: 'Review deleted' });
});

export default router;
