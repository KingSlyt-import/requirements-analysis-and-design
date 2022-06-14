const Car = require('../../../repository/mongo/models/Bike');

class homeController {

    // [GET] /
    home(req, res) {
        res.render('home')
    }
}

module.exports = new homeController();