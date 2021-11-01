const express = require('express')
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const SSLCommerzPayment = require('sslcommerz')
require('dotenv').config()
const { v4: uuidv4 } = require('uuid');


const app = express()
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 5000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q0qwx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const orderCollection = client.db("paymentssl").collection("orders");
    app.post('/init', async (req, res) => {
        console.log("hitting")

        const productInfo = {
            ...req.body,
            total_amount: req.body.price,
            currency: 'BDT',
            tran_id: uuidv4(),
            success_url: 'http://localhost:5000/success',
            fail_url: 'http://localhost:5000/failure',
            cancel_url: 'http://localhost:5000/cancel',
            ipn_url: 'http://localhost:5000/ipn',
            status: 'pending',
            shipping_method: 'Courier',
            product_name: 'Computer',
            product_category: 'Electronic',
            product_profile: 'general',
            cus_name: 'Shabaj',
            cus_email: 'cust@yahoo.com',
            cus_add1: 'Dhaka',
            cus_add2: 'Dhaka',
            cus_city: 'Dhaka',
            cus_state: 'Dhaka',
            cus_postcode: '1000',
            cus_country: 'Bangladesh',
            cus_phone: '01711111111',
            cus_fax: '01711111111',
            ship_name: 'Customer Name',
            ship_add1: 'Dhaka',
            ship_add2: 'Dhaka',
            ship_city: 'Dhaka',
            ship_state: 'Dhaka',
            ship_postcode: 1000,
            ship_country: 'Bangladesh',
            multi_card_name: 'mastercard',
            value_a: 'ref001_A',
            value_b: 'ref002_B',
            value_c: 'ref003_C',
            value_d: 'ref004_D'
        };

        // Insert order info
        const result = await orderCollection.insertOne(productInfo);
        console.log(result);
        const sslcommer = new SSLCommerzPayment(process.env.STORE_ID, process.env.STORE_PASSWORD, false) //true for live default false for sandbox
        sslcommer.init(productInfo).then(data => {
            //process the response that got from sslcommerz 
            //https://developer.sslcommerz.com/doc/v4/#returned-parameters
            const info = { ...productInfo, ...data }
            // console.log(info.GatewayPageURL);
            if (info.GatewayPageURL) {
                res.json(info.GatewayPageURL)
            }
            else {
                return res.status(400).json({
                    message: "SSL session was not successful"
                })
            }

        });
    });
    app.post("/success", async (req, res) => {
        console.log(req.body)
        const result = await orderCollection.updateOne({ tran_id: req.body.tran_id }, {
            $set: {
                val_id: req.body.val_id
            }
        })
        console.log(result)
        res.redirect(`http://localhost:3000/success/${req.body.tran_id}`)

    })
    app.post("/failure", (req, res) => {
        console.log(req.body)
        res.send(req.body);
    })
    app.post("/cancel", (req, res) => {
        console.log(req.body)
        res.send(req.body);
    })
    app.post("/ipn", (req, res) => {
        console.log(req.body)
        res.send(req.body);
    })
    app.get('/validate/:val_id', (req, res) => {
        const data = {

            val_id: req.params.val_id //that you go from sslcommerz response
        };
        const sslcommer = new SSLCommerzPayment(process.env.STORE_ID, process.env.STORE_PASSWORD, false) //true for live default false for sandbox
        sslcommer.validate(data).then(data => {
            //process the response that got from sslcommerz 
            // https://developer.sslcommerz.com/doc/v4/#order-validation-api

            console.log(data)
        });

    })
    app.get('/orders/:tran_id', async (req, res) => {
        const id = req.params.tran_id;
        const result = await orderCollection.findOne({ tran_id: id })
        res.json(result)
    })

});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})