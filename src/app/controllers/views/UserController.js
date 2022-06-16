const fetch = require("node-fetch");
const formidable = require('formidable');

const BASE_URL = process.env.BASE_URL || "http://localhost";
const PORT = process.env.PORT || "";
const HOST = BASE_URL + ':3000';

class UsersController {
    // [POST] /users/login
    loginProcess(req, res) {

        fetch(`${HOST}/api/users/login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: req.body.email,
                password: req.body.password
            })
        })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                if (response.code === 0) {
                    return res.redirect(`/`);
                } else {
                    return res.redirect('login');
                }
            })
            .catch(err => {
                console.log(err);
            })
    }
    // [GET] /users/login
    login(req, res) {
        res.render('users/login')
    }

    // [POST] /users/register
    registerProcess(req, res) {
        fetch(`${HOST}/api/users/register`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: req.body.email,
                password: req.body.password,
                username: req.body.username
            })
        })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                if (response.code === 0) {
                    return res.redirect(`login`);
                } else {
                    return res.redirect('register');
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    // [GET] /users/register
    register(req, res) {
        res.render('users/register')
    }
}

module.exports = new UsersController();