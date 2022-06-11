const Car = require('../../../repository/mongo/models/Bike');

class homeController {

    // [GET] /
    home(req, res) {
        // Car.find({})
        //     .then(cars => {
        //         res.render('home', {
        //            cars: multipleMongooseToObject(cars) 
        //         });
        //     })
        //     .catch(err => next(err));
        res.render('home')
    }
}

module.exports = new homeController();