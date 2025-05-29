const mongoose = require("mongoose");

const UsuerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
}, {
    timestamps: false,
    versionKey: false,
});

module.exports = mongoose.model("User", UsuerSchema);
