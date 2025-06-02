const Movie = require('../models/movie.model');
const Counter = require("../models/counter.model");

// Get all movies
exports.getMovies = async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single movie
exports.getMovie = async (req, res) => {
    try {
        const movie = await Movie.findOne({id : req.params.id});
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.json(movie);
    } catch (error) {
        console.log("message:", error.message);
        res.status(500).json({ message: error.message });
    }
};

// Create a new movie
exports.createMovie = async (req, res) => {
    let movie = new Movie(req.body);

    let counter = await Counter.findOneAndUpdate(
        { model: "Movie" },
        { $inc: { count: 10 } },
        { new: true, upsert: true }
      );

      movie.id = counter.count; 

    try {
        const newMovie = await movie.save();
        res.status(201).json(newMovie);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateMovie = async (req, res) => {
    try {
      const movie = await Movie.findOneAndUpdate(
        {id: req.params.id },   // filtro
        req.body,                 // datos a actualizar
        { new: true }             // retorna el documento actualizado
      );
  
      if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
      }
  
      res.json(movie);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
// Delete a movie
exports.deleteMovie = async (req, res) => {
    try {
        const movie = await Movie.findOneAndDelete({id: req.params.id});
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.json({ message: 'Movie deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 