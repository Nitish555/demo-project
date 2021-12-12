const express = require('express');
// const logger = require('morgan');
// const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const compression = require('compression');
mongoose.Promise = global.Promise;
const cors = require('cors');
const router = express.Router();
const device = require('express-device');
const port = 8082

cors(app)

const mongoConnection = require('./mongoConnection');
const loginModel = require('./models/loginModel');
mongoConnection.mongoConnect()

// loginModel
app.listen(port, function() {
    console.log('listening on ', port)
})

app.use(device.capture());

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Refresh-Access-Token,Accept, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,xAccessToken,Authorization');
    // intercept OPTIONS method
    if (req.method == 'OPTIONS') {
        res.sendStatus(204).end();
        //next();
    } else {
        next();
    }
});

app.use('/demo-login', require('./routes/login'))

app.get('/all-user', (req, res) => {
    loginModel.find({}).then(data => {
        res.status(200).json(data)
    }).catch( (err) => {
        console.log(err);
        res.status(500)
        }
    )
})

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});