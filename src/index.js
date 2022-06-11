// core module
const path = require('path');

// npm module
const express = require('express');
const expressHandlebars = require('express-handlebars');
const flash = require('express-flash');
const session = require('express-session');
const route = require('./routes/index');

require('dotenv').config();

const app = express();

// Database config
const database = require('./repository/mongo/config/index');

// Directory define
const viewsDirectoryPath = path.join(__dirname, './views');
const publicDirectoryPath = path.join(__dirname, './public');

// express config body-parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//mvc models
route(app);

// Server listening
const port = process.env.PORT || 3000;
database.connect()
    .then(() => app.listen(port, () => console.log(`Express started on http://localhost:${port}; ` + 'press Ctrl-C to terminate. ')))
    .catch(e => console.log('Cannot connect to MongoDB Server: ' + e.message));