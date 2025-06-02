const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/schedule.controller');
const verificarToken = require("../middlewares/auth");
const permitirRol = require("../middlewares/roles");

// Get all schedules
router.get('/', verificarToken, scheduleController.getSchedules);
router.get('/admin', verificarToken, permitirRol("admin"), scheduleController.getSchedules);


// Get schedules by movie ID
router.get('/movie/:movieId', scheduleController.getSchedulesByMovieId);

// Get schedules by date
router.get('/date/:date', scheduleController.getSchedulesByDate);

// Get schedules by room
router.get('/room/:room', scheduleController.getSchedulesByRoom);

// Get a single schedule
router.get('/:id', scheduleController.getSchedule);

// Create a new schedule
router.post('/', verificarToken, permitirRol("admin"), scheduleController.createSchedule);

// Update a schedule
router.put('/:id', verificarToken, permitirRol("admin"), scheduleController.updateSchedule);

// Delete a schedule
router.delete('/:id', verificarToken, permitirRol("admin"), scheduleController.deleteSchedule);

// Update seat availability
router.patch('/:scheduleId/seat/:seatId', verificarToken, scheduleController.updateSeatAvailability);

module.exports = router; 