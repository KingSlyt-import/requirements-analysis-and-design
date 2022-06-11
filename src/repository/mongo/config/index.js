const mongoose = require('mongoose');
require('dotenv').config();

const connect = async() => {
    try {
        const mongoURL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_COLLECTION}`;
        // console.log(mongoURL);
        await mongoose.connect(mongoURL);
        console.log('Connect to database successfully!');
    } catch (error) {
        console.log('Cannot connect to database: ' + error.message);
    }
}

module.exports = { connect };