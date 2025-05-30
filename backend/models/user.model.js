const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    id: {type: String, requiered: true, unique: true},
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
}, {
    timestamps: false,
    versionKey: false,
    collection: 'user' 
});

module.exports = mongoose.model("User", UserSchema);
