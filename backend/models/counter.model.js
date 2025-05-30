
const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  model: { type: String, required: true, unique: true },
  count: { type: Number, default: 15 },
});

module.exports = mongoose.model("Counter", counterSchema);
