const BASE_URL = process.env.BASE_URL || "http://localhost";
const PORT = process.env.PORT || "";
const HOST = BASE_URL + (PORT === "" ? "" : `:${PORT}`);

class UsersController {
    // [POST] /users/login
    loginProcess(req, res) {
        let us = req.body.username;
        if (req.body.username === "admin") {
            us = '8742297842';
        }
        fetch(`${HOST}/api/users/login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: us,
                password: req.body.password
            })
        })
            .then(response => response.json())
            .then(response => {
                if (response.code === 0) {
                    return res.redirect(`/users/application/${response.token}`);
                } else {
                    req.flash('errorMsg', response.message);
                    return res.redirect('/users/login');
                }
            })
            .catch(err => {
                console.log(err);
            })
    }
    // [GET] /users/login
    login(req, res) {
        res.render('login')
    }

    // [POST] /users/register
    registerProcess(req, res) {
        const form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {
            let { phone, fullName, email, address, birthDate } = fields;
            if (err) {
                return res.redirect('/Error');
            }
            fetch(`${HOST}/api/users/register`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phone: phone,
                    fullName: fullName,
                    email: email,
                    address: address,
                    birthDate: birthDate,
                    idCardFront: "idCardFront",
                    idCardBack: "idCardBack",
                })
            })
                .then(response => response.json())
                .then(response => {
                    if (response.code === 0) {
                        const { idCardFront, idCardBack } = files;
                        let us = response.data.username;
                        console.log(us);
                        if (us) {
                            console.log(us);
                            let [ idCardFrontName, idCardBackName ] = imgIdCardSave(response.data.username, idCardFront, idCardBack);
                            console.log(idCardFrontName, idCardBackName);
                        }
                        return res.redirect(`/users/application/${response.token}`);
                    } else {
                        req.flash('errorMsg', response.message);
                        return res.redirect('/users/register');
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        });
    }

    // [GET] /users/register
    register(req, res) {
        let errorMsg = req.flash("errorMsg");
        res.render('register', {errorMsg})
    }

    // [GET] /users/application/:token
    application(req, res) {
        const token = req.params.token;
        const data = readJWT(token);
        if(data.firstLog){
            return res.redirect('/users/firstChangePassword/' + token); 
        }
        if (data.code !== 0) {
            return res.redirect('/');
        }
        fetch(`${HOST}/api/users/getUserByUs/${data.username}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
            .then(response => response.json())
            .then(response => {
                if (response.code === 0) {
                    return res.render('application', { 
                        token,
                        ...response.data[0]
                    });
                }
                return res.redirect('/Error');
            })
            .catch(err => {
                return res.redirect('/Error');
            });
    }

    // [GET] /users/userInfor/:token
    userInfor(req, res) {
        const token = req.params.token;
        const data = readJWT(token);
        if (data.code !== 0) {
            return res.redirect('/');
        }
        fetch(`${HOST}/api/users/getUserByUs/${data.username}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
            .then(response => response.json())
            .then(response => {
                if (response.code === 0) {
                    // return res.send(response.data[0]);
                    return res.render('userInfor', {
                        username: data.username,
                        token,
                        ...response.data[0]
                    });
                }
                return res.redirect('/Error');
            })
            .catch(err => {
                return res.redirect('/Error');
            });
        
    }
    
    // [GET] /users/firstChangePassword/:token
    firstChangePassword(req, res) {
        const token = req.params.token;
        const data = readJWT(token);
        if (data.code !== 0) {
            return res.redirect('/');
        }
        return res.render('firstChangePassword', {
            username: data.username,
            token
        })
    }
    
    // [POST] /users/firstChangePassword/:token
    firstChangePasswordProcess(req, res) {
        const token = req.params.token;
        const data = readJWT(token);
        if (data.code !== 0) {
            return res.redirect('/');
        }
        fetch(`${HOST}/api/users/firstChangePassword/${data.username}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                newPassword: req.body.newPassword,
                confirmPassword: req.body.confirmPassword
            })
        })
            .then(response => response.json())
            .then(response => {
                if (response.code === 0) {
                    return res.redirect('/users/application/' + response.token);
                }
                return res.redirect('/Error');
            })
            .catch(err => {
                return res.redirect('/Error');
            });
    }

    // [GET] /users/changePassword/:token
    changePassword(req, res){
        const token = req.params.token;
        const data = readJWT(token);
        if (data.code !== 0) {
            return res.redirect('/');
        }
        return res.render('changePassword', {
            username: data.username,
            token
        })
    }

    // [POST] /users/changePassword/:token
    changePasswordProcess(req, res){
        const token = req.params.token;
        const data = readJWT(token);
        if (data.code !== 0) {
            return res.redirect('/');
        }
        fetch(`${HOST}/api/users/changePassword/${data.username}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                oldPassword: req.body.password,
                newPassword: req.body.newPassword,
                confirmPassword: req.body.confirmPassword
            })
        })
            .then(response => response.json())
            .then(response => {
                if (response.code === 0) {
                    return res.redirect('/users/application/' + token);
                }
                return res.redirect('/Error');
            })
            .catch(err => {
                return res.redirect('/Error');
            });
    }
}

module.exports = new UsersController();