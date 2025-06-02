const Schedule = require('../models/schedule.model');
const Counter = require("../models/counter.model");


// Get all schedules
exports.getSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.find().populate('movieId');
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get schedules by movie ID
exports.getSchedulesByMovieId = async (req, res) => {
    try {
        const schedules = await Schedule.find({ movieId: req.params.movieId }).populate('movieId');
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get schedules by date
exports.getSchedulesByDate = async (req, res) => {
    try {
        const date = new Date(req.params.date);
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));

        const schedules = await Schedule.find({
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        }).populate('movieId');
        
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get schedules by room
exports.getSchedulesByRoom = async (req, res) => {
    try {
        const schedules = await Schedule.find({ room: req.params.room }).populate('movieId');
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single schedule
exports.getSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.findOne({id: req.params.id});
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new schedule
exports.createSchedule = async (req, res) => {
    let schedule = new Schedule(req.body);
    try {
        let counter = await Counter.findOneAndUpdate(
            { model: "Schedule" },
            { $inc: { count: 10 } },
            { new: true, upsert: true }
          );
    
        schedule.id = counter.count; 
        const newSchedule = await schedule.save();
        res.status(201).json(newSchedule);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ message: error.message });
    }
};

// Update a schedule
exports.updateSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.findOneAndUpdate(
            {id: req.params.id},
            req.body,
            { new: true }
        ).populate('movieId');
        
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }
        res.json(schedule);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a schedule
exports.deleteSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.findOneAndDelete({id: req.params.id});
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }
        res.json({ message: 'Schedule deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update seat availability
exports.updateSeatAvailability = async (req, res) => {
    try {
        const { scheduleId, seatId } = req.params;
        const { free } = req.body;

        const schedule = await Schedule.findOne({id:scheduleId});
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        const seat = schedule.seats.find(s => s.id === seatId);
        if (!seat) {
            return res.status(404).json({ message: 'Seat not found' });
        }

        seat.free = free;
        await schedule.save();
        
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 