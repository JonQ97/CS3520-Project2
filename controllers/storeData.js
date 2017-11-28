var express = require('express');
var app = express();
var router = express.Router();
var mongodb = require('mongodb');


//module.exports.storeData =  function (request, response) {

router.post('/storeData', function (req, res, next) {

    var customerID = Math.floor((Math.random() * 1000000000000) + 1);
    var billingID = Math.floor((Math.random() * 1000000000000) + 1);
    var shippingID = Math.floor((Math.random() * 1000000000000) + 1);
    var orderID = Math.floor((Math.random() * 10000) + 1);

    //Shipping default values
    var fName = 'hello';  //retrieve the data associated with name
    var lName = " ";
    var addr1 = " ";
    var addr2 = " ";
    var city = " ";
    var state = " ";
    var zip = " ";
    var phone = " ";
    var email = " ";

    var card = " ";
    var cardNum = " ";
    var cvv = " ";
    var expireMM = " ";
    var expireYY = " ";
    var cardZip = " ";
    var cardName = " ";



    var cardExp = req.body.expireMM + "/" + req.body.expireYY;

    fName = req.body.fName;
    lName = req.body.lName;
    addr1 = req.body.addr1;
    addr2 = req.body.addr2;
    city = req.body.city;
    state = req.body.state;
    zip = req.body.zip;
    phone = req.body.phone;
    email = req.body.email;

    card = req.body.card;
    cardNum = req.body.cardNum;
    cvv = req.body.cvv;
    cardName = req.body.cardName;
    cardZip = req.body.cardZip;

    var date = req.body.date;
    var origPrice = req.body.totalPrice;
    var products = req.body.products;
    var ship = req.body.ship;
    var tax = (+origPrice * 0.08);
    var totalPrice = +origPrice + +ship + +tax;

    var items = req.body.itemNames;



    //Places item names into arrays

    var nameAry = items.split(', ');

    test = nameAry[0];






    //********************************************************************************************************
    //This Code is used to extract the incoming values of 'Product_Vector'
    // and conveniently storing them into 3 separate arrays that could later be iterated over to get the values.

    var prodIDAry = [];
    var quantAry = [];
    var priceAry = [];
    var start_pos; //Starting Postiion
    var end_pos = 0;
    var incr = 0;
    var cur_pos = 0;

    while ( true)
    {

        start_pos = products.indexOf('ProductID_', end_pos) + 10;

        if(cur_pos > start_pos)//checker to break, because indexof will loop infinitely looking for string occurrences
        {
            break;
        }
        cur_pos = start_pos;
        end_pos = products.indexOf(',', start_pos);
        prodIDAry.push(products.substring(start_pos, end_pos));

    }

    end_pos = 0;
    cur_pos = 0;

    while ( true )
    {

        start_pos = products.indexOf('Quantity', end_pos) + 8;

        if(cur_pos > start_pos)
        {
            break;
        }
        cur_pos = start_pos;

        end_pos = products.indexOf(',', start_pos);
        incr += end_pos;
        quantAry.push(products.substring(start_pos, end_pos));


    }

    end_pos = 0;
    cur_pos = 0;

    while ( true )
    {
        start_pos = products.indexOf('Price', end_pos) + 5;

        if(cur_pos > start_pos)
        {
            break;
        }
        cur_pos = start_pos;

        end_pos = products.indexOf('}', start_pos);
        priceAry.push(products.substring(start_pos, end_pos));
    }









    // Create seed data -- it is in JSON format
    var seedCust = [
        {
            _id: customerID,
            FIRSTNAME: fName,
            LASTNAME: lName,
            STREET: addr1,
            CITY: city,
            STATE: state,
            ZIP: zip,
            PHONE: phone,
            EMAIL: email

        }
    ];

    var seedShip = [
        {
            _id: shippingID,
            CUSTOMER_ID: customerID,
            FIRSTNAME: fName,
            LASTNAME: lName,
            Address1: addr1,
            Address2: addr2,
            SHIPPING_CITY: city,
            SHIPPING_STATE: state,
            SHIPPING_ZIP: zip

        }
    ];

    var seedBill = [
        {
            _id: billingID,
            CUSTOMER_ID: customerID,
            CREDITCARDTYPE: card,
            CREDITCARDNUM: cardNum,
            CREDITCARDEXP: cardExp,
            CREDITCARDSECURITYNUM: cvv,
            CARD_NAME: cardName
            //CardZip: cardZip

        }
    ];

    var seedOrder = [
        {
            _id: orderID,
            CUSTOMER_ID: customerID,
            BILLING_ID: billingID,
            SHIPPING_ID: shippingID,
            DATE: date,
            PRODUCT_VECTOR: products,
            ORDER_TOTAL: totalPrice


        }
    ];


// Standard URI format:  mongodb://[dbuser:dbpassword@]host:port/dbname
// GO TO mLab.com account to see what YOUR database URL is
//CHANGE the url so it is correct for your account
    //var uri = 'mongodb://steven:steven@ds259175.mlab.com:59175/songscs3520';
    var uri = 'mongodb://project2TestUser:project2Test@ds255715.mlab.com:55715/heroku_nkdzppr7'

//using mongodb module
    mongodb.MongoClient.connect(uri, function (err, db) {

        if (err) throw err;

        /*
         * First we'll add a  few songs. Nothing is required to create the
         * songs collection;  it is created automatically when we insert.
         */
        var custInfo = db.collection('CUSTOMER');
        var shipping = db.collection('SHIPPING');
        var billing = db.collection('BILLING');
        var order = db.collection('ORDERS');

        // Note that the  insert method can take either an array or a dict.
        custInfo.insert(seedShip, function (err, result) {
            if (err) throw err;
        });

        shipping.insert(seedCust, function (err, result) {
            if (err) throw err;
        });

        billing.insert(seedBill, function (err, result) {
            if (err) throw err;
        });
        order.insert(seedOrder, function (err, result) {
            if (err) throw err;
        });


    });



    res.render('finalOrder',{


        fName: fName,
        lName: lName,
        addr1: addr1,
        addr2: addr2,
        city: city,
        state: state,
        zip: zip,
        phone: phone,
        email: email,

        card: card,
        cardNum: cardNum,
        cvv: cvv,
        cardName: cardName,
        cardZip: cardZip,

        date: date,

        origPrice: origPrice,
        tax: parseFloat(Math.round(tax * 100) / 100).toFixed(2),
        totalPrice: parseFloat(Math.round(totalPrice * 100) / 100).toFixed(2),

        ship: ship,

        products: products,

        prodID: prodIDAry,
        quant: quantAry,
        price: priceAry,

        test: test,

        itemNames: nameAry

    });

});

//};



module.exports = router;

