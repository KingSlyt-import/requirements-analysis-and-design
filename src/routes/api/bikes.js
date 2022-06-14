const express = require('express');
const router = express.Router();

const carController = require('../../app/controllers/api/BikeController');

// router.get('/show', carController.showAllCar);
// router.get('/trash', carController.showTrashCar);
// router.get('/create', carController.createCar);
router.post('/store', carController.storeCar);
// router.get('/edit/:id', carController.editCar);
// router.get('/info/:id', carController.infoCar);
// router.put('/update/:id', carController.updateCar);
// router.patch('/restore/:id', carController.restoreCar);
// router.delete('/force/:id', carController.forceCar);
// router.delete('/:id', carController.deleteCar);


module.exports = router;