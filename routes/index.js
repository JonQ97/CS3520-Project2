var express = require('express');
var app = express();
var router = express.Router();
var mongodb = require('mongodb');
module.exports = router;

/* GET home page. */

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Hello World!' });
});

//########################################
//to process data sent in on request need body-parser module
var bodyParser = require('body-parser');
var path = require ('path'); //to work with separtors on any OS including Windows
var querystring = require('querystring'); //for use in GET Query string of form URI/path?name=value

router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencode
//#########################################

router.post('/readNameAndRespond', function(req, res, next) {

    //expecting data variable called name --retrieve value using body-parser
    var body = JSON.stringify(req.body);  //if wanted entire body as JSON
    var params = JSON.stringify(req.params);//if wanted parameters
    //expecting data variable called name --retrieve value using body-parser

    var value_name = req.body.name;  //retrieve the data associated with name

    //var value_name = req.params.name;  //retrieve the data associated with name
    //res.render('readNameAndRespond', {outputName: req.params.name })

    res.send("hello " + value_name);
});

//LOAD the various controllers
//var controllerMain = require('../controllers/main');   //this will load the main controller file

var controllerMongoCollection = require('../controllers/database'); //load controller code dealing with database mongodb and Routes collection
var controllerstoreData = require('../controllers/storeData');
//MAY HAVE OTHER CODE in index.js

//CODE to route /getAllRoutes to appropriate  Controller function
//**************************************************************************
//***** mongodb get all of the Routes in Routes collection w
//      and Render information iwith an ejs view

router.get('/getAllOrders', controllerMongoCollection.getAllOrders);


//////////////////////////////////////////////////////////////////////////////////////////////////////


//neither app.post nor router.post worked for me to call "storeData" so I took a different route
//app.post('/storeData', controllerstoreData.storeData);



/*
router.post('/readOrderAndRespond', function(req, res, next) {

    var fName = req.body.firstName;  //retrieve the data associated with name
    var lName = req.body.lastName;
    var addr1 = req.body.addr1;
    var addr2 = req.body.addr2;
    var city = req.body.city;
    var state = req.body.state;

    //app.set('firstName', firstName);

    //var value_name = req.params.name;  //retrieve the data associated with name

    //res.render('readOrderAndRespond',
        //{firstName: firstName, lastName: lastName, addr1: addr1, city:city})


    // Create seed data -- it is in JSON format
    var seedData = [
        {
            FirstName: firstName,
            LastName: lastName,
            Address: addr1,
            City: city

        }
    ];


    var customerdata = {
        _id: customerID,
        FIRSTNAME: shipment_info[fname],
        LASTNAME: shipment_info['lname'],
        STREET: shipment_info['add1'] + ' ' + shipment_info['add2'],
        CITY: shipment_info['city'],
        STATE: shipment_info['state'],
        ZIP: shipment_info['zipcode'],
        PHONE: shipment_info['phone']
    };
    CUSTOMERS.insertOne(customerdata, function (err, result) {
        if (err) throw err;
    });

// Standard URI format:  mongodb://[dbuser:dbpassword@]host:port/dbname
// GO TO mLab.com account to see what YOUR database URL is
//CHANGE the url so it is correct for your account
    var uri ='mongodb://steven:steven@ds259175.mlab.com:59175/songscs3520';

//using mongodb module
    mongodb.MongoClient.connect(uri, function(err, db) {

        if(err) throw err;

        /*
         //* First we'll add a  few songs. Nothing is required to create the
         //* songs collection;  it is created automatically when we insert.


        var Customers =  db.collection('Customers');

        // Note that the  insert method can take either an array or a dict.
        Customers.insert(seedData, function(err, result) {
            if(err) throw err;

            /*
             //* Then we need to  give Boyz II Men credit for their contribution
             //* to the hit  "One Sweet Day".


        });
    });


});
*/

//router.post('/insert')





