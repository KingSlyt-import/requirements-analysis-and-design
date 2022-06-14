const { BikeModel } = require('../../../repository/mongo/models/Bike');

class carController {
    // [GET] /cars/show
    showAllCar(req, res, next) {
        Car.find({})
            .then(cars => {
                res.render('cars/show', {
                    cars: multipleMongooseToObject(cars)
                });
            })
            .catch(err => next(err));
    }

    // [GET] /cars/trash
    showTrashCar(req, res, next) {
        Car.findDeleted({})
            .then(cars => {
                res.render('cars/trash', {
                    cars: multipleMongooseToObject(cars)
                });
            })
            .catch(err => next(err));
    }

    // [GET] /cars/info/:id
    infoCar(req, res, next) {
        Car.findById(req.params.id)
            .then(car => {
                res.render('cars/info', {
                    car: mongooseToObject(car)
                });
            })
            .catch(err => next(err));
    }

    // [GET] /cars/create
    createCar(req, res, next) {
        res.render('cars/create');
    }

    // [GET] /cars/edit/:id
    editCar(req, res, next) {
        Car.findById(req.params.id)
            .then(car => res.render('cars/edit',  {
                    car: mongooseToObject(car)
            }))
            .catch(next)
    }

    // [PUT] /cars/update/:id
    updateCar(req, res, next) {
        const updateCar = {
            name : req.body.carName,
            image : req.body.carImage,
            manufacture : req.body.carManufacture,
            engine : req.body.carEngine,
            power : req.body.carPower,
            price : req.body.carPrice,
            topSpeed : req.body.carTopSpeed
        };
        Car.updateOne({ _id: req.params.id }, updateCar)
            .then(() => res.redirect(`../info/${req.params.id}`))
            .catch(next);
    }

    // [POST] /cars/store
    storeCar(req, res, next) {
        let {name, image, brand, engine, power, price, topSpeed} = req.body;

        let newBike = new BikeModel({
            name : name,
            image : image,
            brand : brand,
            engine : engine,
            power : power,
            price : price,
            topSpeed : topSpeed
        });
        newBike.save()
            .then(() => { 
                return res.json({
                    code: 0,
                    data: newBike
                })
            })
            .catch((error) => res.send(error));
    }


    // [DELETE] /cars/:id
    deleteCar(req, res, next) {
        Car.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // [DELETE] /cars/force/:id
    forceCar(req, res, next) {
        Car.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // [PATCH] /courses/restore/:id
    restoreCar(req, res, next) {
        Car.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
}

module.exports = new carController();