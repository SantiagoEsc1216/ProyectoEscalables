const express = require('express');
const router = express.Router();
const {
    getAllReviews,
    getReviewsByMovieId,
    getReviewsByUserId,
    createReview
} = require('../controllers/review.controller');

// Get all reviews
router.get('/', getAllReviews);

// Get reviews by movie ID
router.get('/movie/:movieId', getReviewsByMovieId);

// Get reviews by user ID
router.get('/user/:userId', getReviewsByUserId);

// Create a new review
router.post('/', createReview);

module.exports = router; 