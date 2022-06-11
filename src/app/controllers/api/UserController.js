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
        const {email, password, username} = req.body;

        UserModel.findOne({email})
            .then(user => {
                if (user) {
                    return Promise.reject({
                        code: 3,
                        message: `Email đã tồn tại`
                    });
                }
            })
            .then(() => UserModel.findOne({username}))
            .then(user => {
                if (user) {
                    return Promise.reject({
                        code: 3,
                        message: `Tên tài khoản đã tồn tại`
                    });
                }
            })
            .then(() => bcrypt.hash(password, 10))
            .then((hashed) => {
                
                let user = new UserModel({
                    email,
                    password: hashed,
                    username
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
            .catch(err => {
                return res.json({
                    code: 2,
                    message: err.message
                });
            })
        return;
    }

    // [POST] /api/users/login
    loginProcess(req, res, next) {
        let {email, password} = req.body;
        let user = undefined;

        UserModel.findOne({email})
            .then(acc => {
                if (!acc) {
                    return Promise.reject({
                        code: 3,
                        message: 'Sai tài khoản hoặc mật khẩu, vui lòng đăng nhập lại'
                    });
                }
                user = acc;

                return bcrypt.compare(password, acc.password);
            })
            .then(passwordMatch => {
                if (!passwordMatch) {
                    return Promise.reject({
                        code: 3,
                        message: 'Sai tài khoản hoặc mật khẩu, vui lòng đăng nhập lại'
                    });
                }

                req.session.user = user;
                return res.json({
                    code: 0,
                    message: 'Đăng nhập thành công',
                    data: user
                });
            })
            .catch(err => {
                return res.json({
                    code: 2,
                    message: err.message
                });
            })
        return;
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

        let {oldPassword, newPassword, confirmPassword} = req.body;
        let username = req.params.username;
        let userG = undefined;
        let isMatch = false;

        if (newPassword !== confirmPassword) {
            return res.json({
                code: 3,
                message: 'Mật khẩu xác nhận phải trùng với mật khẩu mới'
            })
        }
        
        UserModel.findOne({username})
            .then(user => {
                if (!user) {
                    return Promise.reject({
                        code: 3,
                        message: 'Không tìm thấy User'
                    });
                }
                
                userG = user
                return bcrypt.compare(oldPassword, user.password);
            })
            .then(passwordMatch => {
                if (!passwordMatch) {
                    isMatch = true;
                    return res.json({
                        code: 3,
                        message: 'Sai mật khẩu'
                    });
                }
                return bcrypt.hash(newPassword, 10);
            })
            .then(hash => {
                if (isMatch) return;
                userG.password = hash;
                
                UserModel.findByIdAndUpdate(userG._id, userG)
                    .then(userUpdate => {
                        if (!userUpdate) {
                            return res.json({
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