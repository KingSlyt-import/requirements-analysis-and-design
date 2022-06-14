const apiUsersRouter = require('./api/users');
const apiBikesRouter = require('./api/bikes');

const usersRouter = require('./views/users');
const bikesRouter = require('./views/bikes');
const homeRouter = require('./views/home');
function route(app) {
    
    // <----- API Router Start ----->

    app.use('/api/users', apiUsersRouter);
    app.use('/api/bikes', apiBikesRouter);

    // <----- API Router End ----->

    // <----- View Router Start ----->

    
    app.use('/users', usersRouter);
    // app.use('/bikes', bikesRouter);

    // <----- View Router End ----->

    // <----- Main Router Start ----->
    
    app.use('/', homeRouter)
    
    // <----- Main Router End ----->
}

module.exports = route;