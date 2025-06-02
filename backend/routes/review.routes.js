const express = require('express');
const router = express.Router();
const {
    getAllReviews,
    getReviewsByMovieId,
    getReviewsByUserId,
    createReview,
    updateReview
} = require('../controllers/review.controller');

// Get all reviews
router.get('/', getAllReviews);

// Get reviews by movie ID
router.get('/movie/:movieId', getReviewsByMovieId);

// Get reviews by user ID
router.get('/user/:userId', getReviewsByUserId);

// Create a new review
router.post('/', createReview);

// Update a review
router.put('/:id', updateReview);

module.exports = router; 