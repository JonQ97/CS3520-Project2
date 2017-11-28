var mongodb = require('mongodb');
var mongoDBURI = process.env.MONGODB_URI || 'mongodb://project2TestUser:project2Test@ds255715.mlab.com:55715/heroku_nkdzppr7';

/** getAllRoutes controller logic that current does model logic too -connects to Mongo database and
 * queries the Routes collection to retrieve all the routes and build the output usig the
 * ejs template mongodb.ejs found in views directory
 * @param request
 * @param response
 */

module.exports.getAllOrders =  function (request, response) {

    mongodb.MongoClient.connect(mongoDBURI, function(err, db) {
        if(err) throw err;

        //get collection of orders
        var Orders = db.collection('ORDERS');

        //FIRST showing you one way of making request for ALL ORDERS and cycle through with a forEach loop on returned Cursor
        //   this request and loop  is to display content in the  console log
        var c = Orders.find({});

        c.forEach(
            function(myDoc) {
                console.log( "name: " + myDoc.name );  //just logging the output to the console
            }
        );

        //SECOND -show another way to make request for ALL orders and simply collect the documents as an
        //   array called docs that you  forward to the getAllOrders.ejs view for use there
        Orders.find().toArray(function (err, docs) {
            if(err) throw err;

            response.render('getAllOrders', {results: docs});

        });
        //close connection when your app is terminating.
        db.close(function (err) {
            if(err) throw err;
        });
    });//end of connect
};//end function