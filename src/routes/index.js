const apiUsersRouter = require('./api/users');
const apiCarsRouter = require('./api/bikes');

const usersRouter = require('./views/users');
const carsRouter = require('./views/bikes');

function route(app) {
    
    // <----- API Router Start ----->

    app.use('/api/users', apiUsersRouter);
    // app.use('/api/bikes', apiBikesRouter);

    // <----- API Router End ----->

    // <----- View Router Start ----->

    // app.use('/users', usersRouter);
    // app.use('/bikes', bikesRouter);

    // <----- View Router End ----->

    // <----- Main Router Start ----->

    // <----- Main Router End ----->
}

module.exports = route;