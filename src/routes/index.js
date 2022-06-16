const apiUsersRouter = require('./api/users');
const apiBikesRouter = require('./api/home');

const usersRouter = require('./views/users');
const homeRouter = require('./views/home');
function route(app) {
    
    // <----- API Router Start ----->

    app.use('/api/users', apiUsersRouter);
    app.use('/api/bikes', apiBikesRouter);

    // <----- API Router End ----->

    // <----- View Router Start ----->

    
    app.use('/users', usersRouter);

    // <----- View Router End ----->

    // <----- Main Router Start ----->
    
    app.use('/', homeRouter)
    
    // <----- Main Router End ----->
}

module.exports = route;