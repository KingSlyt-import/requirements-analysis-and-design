const bcrypt = require('bcrypt');

const { UserModel } = require('../../../repository/mongo/models/User');

class UsersController {
    // [GET] /
    usersController(req, res, next) {
        res.json({
            code: 0,
            message: 'Thành công UsersController',
        });
    }

    // [POST] /api/users/register
    registerProcess(req, res, next) {
        const {username, phone, fullName, birthDate, address} = req.body;

        UserModel.findOne({email})
            .then(user => {
                if (user) {
                    return Promise.reject({
                        code: 3,
                        message: `Email đã tồn tại`
                    });
                }
            })
            .then(() => User.findOne({phone}))
            .then(user => {
                if (user) {
                    return Promise.reject({
                        code: 3,
                        message: `Số điện thoại đã tồn tại`
                    });
                }
            })
            .then(() => bcrypt.hash(password, 10))
            .then((hashed) => {
                let user = new User({
                    phone,
                    email,
                    fullName,
                    birthDate: new Date(birthDate + 'Z').toISOString(),
                    address,
                    username,
                    idCardFront: `/img/users/${username}/idCardFront.png`,
                    idCardBack: `/img/users/${username}/idCardBack.png`,
                    password: hashed
                });
                user.save()
                    .then(() => {
                        return res.json({
                            code: 0,
                            message: 'Đăng ký tài khoản thành công',
                            data: user
                        })
                    })
                    .catch(err => {
                        return res.json({
                            code: 2,
                            message: 'Đăng ký tài khoản thất bại',
                            error: err.message
                        })
                    })
            })
            .then(() => {
                let mailData = {
                    title: 'Register',
                    to: email,
                    data: {
                        username,
                        password
                    }
                }
                sendMail.sendMail(mailData);
            })
            .catch(err => {
                return res.json(err)
            })
        return;
    }

    // [POST] /api/users/login
    loginProcess(req, res, next) {
        let result = validationResult(req);
        if (result.errors.length === 0) {
            let {username, password} = req.body;
            let user = undefined;

            User.findOne({username})
                .then(acc => {
                    if (!acc) {
                        return Promise.reject({
                            code: 3,
                            message: 'Sai tên tài khoản'
                        });
                    }
                    user = acc;

                    return bcrypt.compare(password, acc.password);
                })
                .then(passwordMatch => {
                    if (user.status === 'disabled') {
                        return res.json({
                            code: 3,
                            message: 'Tài khoản này đã bị vô hiệu hóa, vui lòng liên hệ tổng đài 18001008'
                        });
                    }

                    if (user.softDisabled) {
                        return res.json({
                            code: 3,
                            message: 'Tài khoản đã bị vô hiệu hóa do nhập sai mật khẩu nhiều lần, vui lòng liên hệ quản trị viên để được hỗ trợ'
                        });
                    }

                    if (!user.softDisabled && user.loginAttempt.penalty === true) {
                        let timeLeft = Date.now() - user.loginAttempt.lastTime;
                        if (timeLeft <= 60000) {
                            return res.json({
                                code: 2,
                                message: 'Tài khoản hiện tại đang bị tạm khóa, vui lòng thử lại sau 1 phút'
                            });
                        }
                    }
                    
                    if (!passwordMatch) {
                        if (user.role !== 'admin') {
                            let dataUpdate = undefined;
                            if (user.loginAttempt.count >= 2) {
                                if (user.loginAttempt.penalty === true) {
                                    dataUpdate = {
                                        softDisabled: true
                                    };
                                } else {
                                    dataUpdate = {
                                        loginAttempt: {
                                            count: 0,
                                            lastTime: new Date(),
                                            penalty: true
                                        }
                                    };
                                }
                            } else {
                                dataUpdate = {
                                    loginAttempt: {
                                        ...user.loginAttempt,
                                        count: user.loginAttempt.count + 1,
                                    }
                                };
                            }
                            User.findOneAndUpdate({_id: user._id}, dataUpdate) 
                                .then(userUpdate => {
                                    if (userUpdate) {
                                        return res.status(401).json({
                                            code: 3,
                                            message: 'Đăng nhập thất bại, mật khẩu không chính xác'
                                        });
                                    }
                                    return res.json({
                                        code: 0,
                                        message: 'Không tìm thấy username'
                                    });
                                })
                                .catch(err => {
                                    return res.json({
                                        code: 3,
                                        message: err.message
                                    });
                                });
                            return;
                        } else {
                            return res.status(401).json({
                                code: 3,
                                message: 'Đăng nhập thất bại, mật khẩu không chính xác'
                            });
                        }
                    }
                    else {
                        const {JWT_SECRET_KEY} = process.env;
                        jwt.sign({
                            id : user._id,
                            username: user.username,
                            email: user.email,
                            phone: user.phone,
                            role: user.role,
                            status: user.status,
                            firstLog: user.firstLog
                        }, JWT_SECRET_KEY ,{
                            expiresIn: '1h'
                        }, (err, token) => {
                            if (err) throw err;
                            User.findOneAndUpdate({_id: user._id}, {
                                loginAttempt: {
                                    count: 0,
                                    lastTime: new Date(),
                                    penalty: false
                                }
                            })
                                .then(() => {
                                    return res.json({
                                        code: 0,
                                        message: 'Đăng nhập thành công',
                                        token: token
                                    });
                                })
                                .catch(err => {
                                    return res.json({
                                        code: 0,
                                        message: err.message
                                    });
                                });
                        });
                    }
                })
                .catch(err => {
                    return res.status(401).json({
                        code: 2,
                        message: 'Đăng nhập thất bại'
                    });
                })
            return;
        }
        let messages = result.mapped();
        let message = '';
        for(let mess in messages) {
            message  = messages[mess].msg;
            break
        }
        return res.json({
            code: 1,
            message
        });
    }

    // [GET] /api/users/getUserByUs/:us
    getUserByUs(req, res, next) {
        let {us} = req.params;

        User.find({username: us})
            .select(" -username -password -otp -__v")
            .then(user => {
                return res.json({
                    code: 0,
                    message: 'Lấy User thành công',
                    data: user
                });
            })
            .catch(err => {
                return res.json({
                    code: 2,
                    message: err.message
                });
            });
    }

    // [PUT] /api/users/updateStatusUser/:id
    updateStatusUser(req, res, next) {
        let {id} = req.params;
        if (!id) {
            return res.json({
                code: 1,
                message: 'Không có thông tin user'
            });
        }
        let status = req.body.status;
        if (!status) {
            return res.json({
                code: 1,
                message: 'Không có trạng thái cần cập nhật'
            });
        }

        User.findByIdAndUpdate(id, {status}, {
            new: true
        })
            .then((user) => {
                if (user) {
                    return res.json({
                        code: 0,
                        message: 'Đã cập nhật user thành công',
                        data: user
                    });
                }
                return res.json({
                    code: 0,
                    message: 'Không tìm User'
                });
            })
            .catch(err => {
                if (err.message.includes('Cast to ObjectId failed')) {
                    return res.json({
                        code: 3,
                        message: 'Không phải Id hợp lệ'
                    });
                }
                return res.json({
                    code: 3,
                    message: err.message
                });
            })
    }

    // [PUT] /api/users/changePassword/:username
    changePassword(req, res, next) {
        let result = validationResult(req);
        if (result.errors.length === 0) {
            let {oldPassword, newPassword} = req.body;
            let username = req.params.username;
            let userG = undefined;
            let isMatch = false;
            User.findOne({username})
            .then(user => {
                    if (user) {
                        userG = user
                        return bcrypt.compare(oldPassword, user.password);
                    }
                    return res.json({
                        code: 0,
                        message: 'Không tìm thấy User'
                    });
                })
                .then(passwordMatch => {
                    if (!passwordMatch) {
                        isMatch = true;
                        return res.status(401).json({
                            code: 3,
                            message: 'Sai mật khẩu'
                        });
                    }
                    return bcrypt.hash(newPassword, 10);
                })
                .then(hash => {
                    if (isMatch) return;
                    userG.password = hash;
                    
                    User.findByIdAndUpdate(userG._id, userG)
                        .then(userUpdate => {
                            if (!userUpdate) {
                                return res.status(401).json({
                                    code: 3,
                                    message: 'Đăng nhập thất bại, mật khẩu không chính xác'
                                });
                            }
                            return res.json({
                                code: 0,
                                message: 'Cập nhật Password thành công'
                            });
                        })
                        .catch(err => {
                            return res.json({
                                code: 3,
                                message: err.message
                            });
                        });
                    return;
                })
                .catch(err => {
                    if (err.message.includes('Cast to ObjectId failed')) {
                        return res.json({
                            code: 3,
                            message: 'Không phải Id hợp lệ'
                        });
                    }
                    return res.json({
                        code: 3,
                        message: err.message
                    });
                });
        }
        else {
            let messages = result.mapped();
            let message = '';
            for(let mess in messages) {
                message  = messages[mess].msg;
                break
            }
            return res.json({
                code: 1,
                message
            });
        }
    }

    // [POST] /api/users/resetPassword
    resetPassword(req, res, next) {
        let result = validationResult(req);

        let { confirmPassword } = req.body;

        let { id } = req.user;

        if (result.errors.length === 0) {

            bcrypt.hash(confirmPassword, 10)
                .then(hashedPassword => {
                    User.findOneAndUpdate({ _id: id }, { password: hashedPassword })
                        .then(() => {
                            return res.json({
                                code: 0,
                                message: 'Cập nhật password thành công',
                            });
                        })
                        .catch(err => {
                            return res.json({
                                code: 0,
                                message: err.message
                            });
                        });
                })

            return;
        }

        let messages = result.mapped();
        let message = '';
        for (let mess in messages) {
            message = messages[mess].msg;
            break
        }
        return res.json({
            code: 1,
            message
        });
    }
}

module.exports = new UsersController();