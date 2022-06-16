const fetch = require("node-fetch");

const BASE_URL = process.env.BASE_URL || "http://localhost";
const PORT = process.env.PORT || "";
const HOST = BASE_URL + ':3000';

class homeController {

    // [GET] /
    showAllBikes(req, res) {

        fetch(`${HOST}/api/bikes/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(response => {
                if (response.code === 0) {
                    return res.render('home', {bikes: response.data});
                } else {
                    return res.redirect('login');
                }
            })
            .catch(err => {
                console.log(err);
            })
    }
}

module.exports = new homeController();