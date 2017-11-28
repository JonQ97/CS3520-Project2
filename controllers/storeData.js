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

    var sfName = 'shello';  //retrieve the data associated with name
    var slName = " ";
    var saddr1 = " ";
    var saddr2 = " ";
    var scity = " ";
    var sstate = " ";
    var szip = " ";
    var sphone = " ";
    var semail = " ";

    var card = " ";
    var cardNum = " ";
    var CVV = " ";
    var expireMM = " ";
    var expireYY = " ";
    var czip = " ";
    var cname = " ";

    /*  ALL POST PARAMETERS FROM FINALORDER2.PHP:
    ->addPostParameter('fName', $_SESSION['fName'])
    ->addPostParameter('lName', $_SESSION['lName'])
    ->addPostParameter('addr1', $_SESSION['addr1'])
    ->addPostParameter('addr2', $_SESSION['addr2'])
    ->addPostParameter('city', $_SESSION['city'])
    ->addPostParameter('state', $_SESSION['state'])
    ->addPostParameter('zip', $_SESSION['zip'])
    ->addPostParameter('phone', $_SESSION['phone'])
    ->addPostParameter('email', $_SESSION['email'])
    ->addPostParameter('sameAsBilling', $_SESSION['sameAsBilling'])

    ->addPostParameter('sfName', $_SESSION['sfName'])
    ->addPostParameter('slName', $_SESSION['slName'])
    ->addPostParameter('saddr1', $_SESSION['saddr1'])
    ->addPostParameter('saddr2', $_SESSION['saddr2'])
    ->addPostParameter('scity', $_SESSION['scity'])
    ->addPostParameter('sstate', $_SESSION['sstate'])
    ->addPostParameter('szip', $_SESSION['szip'])
    ->addPostParameter('sphone', $_SESSION['sphone'])
    ->addPostParameter('semail', $_SESSION['semail'])

    ->addPostParameter('card', $_SESSION['card'])
    ->addPostParameter('cardNum', $_SESSION['cardNum'])
    ->addPostParameter('CVV', $_SESSION['CVV'])
    ->addPostParameter('expireMM', $_SESSION['expireMM'])
    ->addPostParameter('expireYY', $_SESSION['expireYY'])
    ->addPostParameter('czip', $_SESSION['czip'])
    ->addPostParameter('cname', $_SESSION['cname'])

    ->addPostParameter('products', $productStr)
    ->addPostParameter('date', $date )
    ->addPostParameter('ship', $_SESSION['ship'])
    ->addPostParameter('totalCost', $_SESSION['totalCost'])
    */

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

    sfName = req.body.sfName;
    slName = req.body.slName;
    saddr1 = req.body.saddr1;
    saddr2 = req.body.saddr2;
    scity = req.body.scity;
    sstate = req.body.sstate;
    szip = req.body.szip;
    sphone = req.body.sphone;
    semail = req.body.semail;

    card = req.body.card;
    cardNum = req.body.cardNum;
    CVV = req.body.CVV;
    cname = req.body.cname;
    czip = req.body.czip;

    var date = req.body.date;
    var origPrice = req.body.totalCost;
    var products = req.body.products;
    var ship = req.body.ship;
    var tax = (+origPrice * 0.08);
    var totalCost = +origPrice + +ship + +tax;

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
            FIRSTNAME: sfName,
            LASTNAME: slName,
            Address1: saddr1,
            Address2: saddr2,
            SHIPPING_CITY: scity,
            SHIPPING_STATE: sstate,
            SHIPPING_ZIP: szip

        }
    ];

    var seedBill = [
        {
            _id: billingID,
            CUSTOMER_ID: customerID,
            CREDITCARDTYPE: card,
            CREDITCARDNUM: cardNum,
            CREDITCARDEXP: cardExp,
            CREDITCARDSECURITYNUM: CVV,
            CARD_NAME: cname
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
            ORDER_TOTAL: totalCost


        }
    ];


// Standard URI format:  mongodb://[dbuser:dbpassword@]host:port/dbname
// GO TO mLab.com account to see what YOUR database URL is
//CHANGE the url so it is correct for your account
    //var uri = 'mongodb://steven:steven@ds259175.mlab.com:59175/songscs3520';
    var uri = 'mongodb://project2TestUser:project2Test@ds255715.mlab.com:55715/heroku_nkdzppr7';

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

        sfName: sfName,
        slName: slName,
        saddr1: saddr1,
        saddr2: saddr2,
        scity: scity,
        sstate: sstate,
        szip: szip,
        sphone: sphone,
        semail: semail,

        card: card,
        cardNum: cardNum,
        cvv: CVV,
        cardName: cname,
        cardZip: czip,

        date: date,

        origPrice: origPrice,
        tax: tax,
        totalCost: totalCost,

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

