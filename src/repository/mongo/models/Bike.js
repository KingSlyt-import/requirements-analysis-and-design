const mongoose = require('mongoose');

const BikeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    brand: { type: String, required: true },
    engine: { type: String, required: true },
    power: { type: String, required: true },
    price: { type: String, required: true },
    topSpeed: { type: String },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now }
});

const BikeModel = mongoose.model('Bike', BikeSchema);

module.exports = { BikeSchema, BikeModel };