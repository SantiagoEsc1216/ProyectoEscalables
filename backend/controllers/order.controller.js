const Order = require('../models/order.model');
const Schedule = require('../models/schedule.model');
const User = require('../models/user.model')

// Get all orders
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate({
                path: 'schedule',
                populate: {
                    path: 'movieId'
                }
            });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOrdersByUser = async (req, res) => {
    try {
        // Buscar al usuario por su campo personalizado `id`
        const user = await User.findOne({ id: req.params.userId });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Buscar las órdenes usando el _id real de MongoDB
        const orders = await Order.find({ user: user._id })
            .populate('user', 'name email')
            .populate({
                path: 'schedule',
                populate: {
                    path: 'movieId'
                }
            });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single order
exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findOne({id : req.params.id})
            .populate('user', 'name email')
            .populate({
                path: 'schedule',
                populate: {
                    path: 'movieId'
                }
            });
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        // Update seat availability in schedule
        const schedule = await Schedule.findById(req.body.schedule);
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        // Update seats in schedule
        for (const seatId of req.body.seats) {
            console.log("seats:", schedule.seats,"\n");
            const seat = schedule.seats.find(s => s.id === seatId);
            if (!seat) {
                return res.status(400).json({ message: `Seat ${seatId} not found` });
            }
            if (!seat.free) {
                return res.status(400).json({ message: `Seat ${seatId} is already taken` });
            }
            console.log("seat:", seat,"\n");
            seat.free = false;
            console.log("seat:", seat,"\n");
        }
        schedule.markModified('seats');
        await schedule.save();

        const usuario = await User.findOne({ id: req.body.user });
        if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        req.body.user = usuario._id;

        // Create order
        const order = new Order(req.body);
        const newOrder = await order.save();

        const populatedOrder = await Order.findOne({id: order.id})
            .populate('user', 'name email')
            .populate({
                path: 'schedule',
                populate: {
                    path: 'movieId'
                }
            });

        res.status(201).json(populatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an order
exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('user', 'name email')
         .populate({
            path: 'schedule',
            populate: {
                path: 'movieId'
            }
        });
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Free up the seats in the schedule
        const schedule = await Schedule.findById(order.schedule);
        if (schedule) {

            for (const seatId of order.seats) {
                const seat = schedule.seats.find(s => s.id === seatId);
                if (seat) {
                    seat.free = true;
                }
            }
            await schedule.save();
        }

        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 