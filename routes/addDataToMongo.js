//A Node script  connecting to a MongoDB database given a MongoDB Connection URI.

var mongodb = require('mongodb');

// Create seed data -- it is in JSON format
//_id, CUSTOMER_ID, BILLING_ID, SHIPPING_ID, DATE, PRODUCT_VECTOR, ORDER_TOTAL
var seedData = [
    {
        CUSTOMER_ID: '0001',
        BILLING_ID: 'Jon Snow',
        SHIPPING_ID: 'Castle Winterfell',
        DATE: 2017,
        PRODUCT_VECTOR: 'Targaryean',
        ORDER_TOTAL: 800
    },
    {
        CUSTOMER_ID: '0002',
        BILLING_ID: 'Daenerys Targaryean',
        SHIPPING_ID: 'Dragon Stone',
        DATE: 2018,
        PRODUCT_VECTOR: 'Targaryean',
        ORDER_TOTAL: 900
    },
    {
        CUSTOMER_ID: '0003',
        BILLING_ID: 'Gregor Clegane',
        SHIPPING_ID: 'The Mountain',
        DATE: 2019,
        PRODUCT_VECTOR: 'House Lannister',
        ORDER_TOTAL: 1000
    },
    {
        CUSTOMER_ID: '0004',
        BILLING_ID: 'Sandor Clegane',
        SHIPPING_ID: 'The Hound',
        DATE: 2020,
        PRODUCT_VECTOR: 'House Clegane',
        ORDER_TOTAL: 1100
    }
];

// Standard URI format:  mongodb://[dbuser:dbpassword@]host:port/dbname
//var uri ='mongodb://project2TestUser:project2Test@ds064198.mlab.com:64198/project-2-orders';
var uri ='mongodb://project2TestUser:project2Test@ds255715.mlab.com:55715/heroku_nkdzppr7';

//using mongodb module
mongodb.MongoClient.connect(uri, function(err, db) {

    if(err) throw err;

    var ORDERS =  db.collection('ORDERS');

    // Note that the insert method can take either an array or a dict.
    ORDERS.insert(seedData, function(err, result) {
        if(err) throw err;

        ORDERS.update(
            { CUSTOMER_ID: '0003' },
            { $set: {  PRODUCT_VECTOR: 'House Clegane' } },
            function (err,  result) {
                if(err) throw  err;
                ORDERS.find({ DATE : { $gte: 10 } }).sort({ CUSTOMER_ID: 1}).toArray(function (err, docs) {
                    if(err)  throw err;
                    docs.forEach(function  (doc) {
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