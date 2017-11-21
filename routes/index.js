var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
module.exports = router;
//LOAD the various controllers
//var controllerMain = require('../controllers/main');   //this will load the main controller file
var controllerMongoCollection = require('../controllers/database'); //load controller code dealing with database mongodb and Routes collection

//MAY HAVE OTHER CODE in index.js
//CODE to route /getAllOrders to appropriate  Controller function
//**************************************************************************
//***** mongodb get all of the Orders in ORDERS collection
//      and Render information with an ejs view
router.get('/getAllOrders', controllerMongoCollection.getAllOrders);

router.post('/readOrderAndRespond', function(req, res, next) {
    var $firstName = req.body.$firstName;
// Create seed data -- it is in JSON format
//_id, CUSTOMER_ID, BILLING_ID, SHIPPING_ID, DATE, PRODUCT_VECTOR, ORDER_TOTAL
    var seedData = [
        {
            $firstName: '$firstName',
        }
    ];

// Standard URI format:  mongodb://[dbuser:dbpassword@]host:port/dbname
//var uri ='mongodb://project2TestUser:project2Test@ds064198.mlab.com:64198/project-2-orders';
    var uri = 'mongodb://project2TestUser:project2Test@ds255715.mlab.com:55715/heroku_nkdzppr7';

//using mongodb module
    mongodb.MongoClient.connect(uri, function (err, db) {

        if (err) throw err;

        var ORDERS = db.collection('ORDERS');

        // Note that the insert method can take either an array or a dict.
        ORDERS.insert(seedData, function (err, result) {
            if (err) throw err;

            ORDERS.update(
                {CUSTOMER_ID: '0003'},
                {$set: {PRODUCT_VECTOR: 'House Clegane'}},
                function (err, result) {
                    if (err) throw  err;
                    ORDERS.find({DATE: {$gte: 10}}).sort({CUSTOMER_ID: 1}).toArray(function (err, docs) {
                        if (err) throw err;
                        docs.forEach(function (doc) {
                            console.log('ORDER: ' + doc['CUSTOMER_ID'] + ', ' + doc['BILLING_ID'] + ' by ' + doc ['SHIPPING_ID']
                                + ' was ordered ' + doc['DATE']);
                        });
                        //_id, CUSTOMER_ID, BILLING_ID, SHIPPING_ID, DATE, PRODUCT_VECTOR, ORDER_TOTAL
                        // uncomment the following code if you wish to drop the collection (like a table) songs
                        /***************************commented OUT
                         songs.drop(function (err) {
              if(err)  throw err;
              // Only  close the connection when your app is terminating.
              db.close(function  (err) {
                if(err)  throw err;
               });
            });
                         */
                    });
                }
            );
        });
    });
});