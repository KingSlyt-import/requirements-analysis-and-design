const {BikeModel} = require('../../../repository/mongo/models/Bike');

class homeController {

    // [GET] /
    showAllBikes(req, res, next) {
        BikeModel.find({})
            .then(bikes => {
                return res.json({
                    code: 0,
                    message: 'Data xe máy',
                    data: bikes
                })
            })
            .catch(err => next(err));
    }
}

module.exports = new homeController();