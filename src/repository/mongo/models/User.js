const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: "user" },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = { UserSchema, UserModel };