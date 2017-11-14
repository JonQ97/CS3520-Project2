var express = require('express');
var router = express.Router();

//LOAD the various controllers
var controllerMain = require('../controllers/main');   //this will load the main controller file
var controllerMongoCollection = require('../controllers/database'); //load controller code dealing with database mongodb and Routes collection

//MAY HAVE OTHER CODE in index.js


//CODE to route /getAllOrders to appropriate  Controller function
//**************************************************************************
//***** mongodb get all of the Orders in ORDERS collection
//      and Render information with an ejs view
router.get('/getAllOrders', controllerMongoCollection.getAllOrders);

/*
* Taken from  http://docs.mongodb.org/ecosystem/drivers/node-js/
 * A Node script  connecting to a MongoDB database given a MongoDB Connection
URI.
*/

var mongodb = require('mongodb');

// Create seed data -- it is in JSON format

//_id, CUSTOMER_ID, BILLING_ID, SHIPPING_ID, DATE, PRODUCT_VECTOR, ORDER_TOTAL
var seedData = [
    {
        CUSTOMER_ID: '1970TEST',
        BILLING_ID: 'Debby  BooneTEST',
        SHIPPING_ID: 'You Light  Up My LifeTEST',
        DATE: 10,
        PRODUCT_VECTOR: 'testTEST',
        ORDER_TOTAL: 100,
    },
    {
        CUSTOMER_ID: '1980s',
        BILLING_ID: 'Olivia  Newton-John',
        SHIPPING_ID: 'Physical',
        DATE: 10,
        PRODUCT_VECTOR: 'test',
        ORDER_TOTAL: 100,
    },
    {
        CUSTOMER_ID: '1990s',
        BILLING_ID: 'Mariah  Carey',
        SHIPPING_ID: 'One Sweet  Day',
        DATE: 16,
        PRODUCT_VECTOR: 'test',
        ORDER_TOTAL: 100,
    }
];

// Standard URI format:  mongodb://[dbuser:dbpassword@]host:port/dbname
// GO TO mLab.com account to see what YOUR database URL is
//CHANGE the url so it is correct for your account
var uri ='mongodb://project2TestUser:project2Test@ds064198.mlab.com:64198/project-2-orders';

//using mongodb module
mongodb.MongoClient.connect(uri, function(err, db) {

    if(err) throw err;

    /*
     * First we'll add a  few songs. Nothing is required to create the
     * songs collection;  it is created automatically when we insert.
     */
    var ORDERS =  db.collection('ORDERS');

    // Note that the  insert method can take either an array or a dict.
    ORDERS.insert(seedData, function(err, result) {
        if(err) throw err;

        /*
         * Then we need to  give Boyz II Men credit for their contribution
         * to the hit  "One Sweet Day".
         */
        ORDERS.update(
            { ORDER: 'One  Sweet Day' },
            { $set: {  BILLING_ID: 'Mariah Carey ft. Boyz II MenTEST' } },
            function (err,  result) {
                if(err) throw  err;
                /*
                 * Finally we  run a query which returns all the hits that spend 10 or
                 * more weeks  at number 1.
                 */
                songs.find({ DATE : { $gte: 10 } }).sort({ CUSTOMER_ID: 1}).toArray(function (err, docs) {
                    if(err)  throw err;
                    docs.forEach(function  (doc) {
                        console.log('In the  ' + doc['shopping cart'] + ', ' + doc['item ordered'] + ' by ' + doc ['customer']
                            + ' was ordered ' + doc['DATE'] + ' at a time.');
                    });

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

/* GET home page.
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/


module.exports = router;
