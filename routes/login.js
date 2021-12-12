const express = require("express");
const app = express.Router();
const bodyParser = require('body-parser');
const loginModel = require("../models/loginModel");
var bcrypt = require('bcrypt');
const { ObjectID } = require("bson");
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb','extended':'true'}));
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.post('/login', (req, res) => {
    let email = req.body.email.toLowerCase();
    let pass = req.body.password;
    loginModel.findOne({
        email: email,
    }).then(data => {
        if (data) {
            bcrypt.compare(pass, data.password, async function (err, resultCompare) {
                if(err) {
                    return res.status(401).json({
                        status: 401,
                        message: 'Something went wrong !!'
                    })
                }                
                else if (resultCompare) {
                    return res.status(200).json({
                        status: 200,
                        results: data
                    });
                } else {
                    return res.status(403).json({
                        status: 403,
                        message: 'Wrong user ID or Password!!'
                    })
                }
            });
        } else {
            return res.status(404).json({
                status: 404,
                message: "User Doesn't Exists"
            })
        }
    }).catch(err => res.status(500))
});

app.post('/signup', (req, res) => {
    let obj = {
        email: req.body.email.toLowerCase(),
        username: req.body.username,
        password: req.body.password,
        phone: req.body.phone,
        address: req.body.address
    }
    loginModel.findOne({
        email: req.body.email.toLowerCase()
    }).then(data => {
        if(data) {
            return res.status(201).json({
                status: 201,
                message: "Email Already Exists"
            });
        } else {
            loginModel.create(obj, function (err, status) {
                if (err) {
                    console.log("Error: ", err);
                    throw err;
                }
                if (status) {
                    return res.status(200).json({
                        status: 200,
                        message: "User Registered successfully!!"
                    });
                }
            });
        }
    }).catch(err => res.status(500))
});


app.get('/getUserDataById/:id', (req, res) => {
    let userId = req.params.id;
    if(userId) {
        loginModel.findOne({
            "_id": ObjectID(userId)
        }).then(data => {
            if(data) {
                return res.status(200).json({
                    status: 200,
                    results: data
                })
            }
        }).catch(err => res.status(500))
    }
});

app.get('/getUserData/:userType', (req, res) => {
    let userType = req.params.userType;
    if(userType) {
        loginModel.find({
            "userType": userType
        }).then(data => {
            if(data) {
                return res.status(200).json({
                    status: 200,
                    results: data
                })
            } else {
                return res.status(401).json({
                    status: 401,
                    message: "No Data Found!!"
                })
            }
        }).catch(err => res.status(500))
    }
});

app.post('/updateUserProfile', (req, res) => {
    loginModel.findOne({
        email: req.body.email
    }).then(data => {
        if (data) {
            loginModel.updateOne({
                email: req.body.email
            },
                {
                    $set: {
                        phone: req.body.phone,
                        address: req.body.address
                    }
                }, function (error1, respon) {
                    if (error1) {
                        return res.json({
                            status: 400,
                            message: "Data not updated!!"
                        });
                    }
                    return res.json({
                        status: 200,
                        message: "Data Updated!!"
                    });
                });
        } else {
            return res.status(401).json({
                status: 401,
                message: "No Data Found!!"
            })
        }
    }).catch(err => res.status(500))
})

module.exports = app;