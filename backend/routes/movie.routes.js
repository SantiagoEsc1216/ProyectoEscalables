const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie.controller');
const verificarToken = require("../middlewares/auth");
const permitirRol = require("../middlewares/roles");

// Get all movies
router.get('/', movieController.getMovies);
router.get('/admin', verificarToken, permitirRol("admin"), movieController.getMovies);

// Get a single movie
router.get('/:id', movieController.getMovie);

// Create a new movie
router.post('/', verificarToken, permitirRol("admin"), movieController.createMovie);

// Update a movie
router.put('/:id', verificarToken, permitirRol("admin"), movieController.updateMovie);

// Delete a movie
router.delete('/:id', verificarToken, permitirRol("admin"), movieController.deleteMovie);

module.exports = router; 