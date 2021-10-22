const express = require('express')

const SSLCommerzPayment = require('sslcommerz')
require('dotenv').config()


const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 5000;

app.get('/init/:amount', (req, res) => {
    
    const data = {
        total_amount: req.params.amount,
        currency: 'BDT',
        tran_id: 'REF123',
        success_url: 'http://localhost:5000/success',
        fail_url: 'http://localhost:5000/failure',
        cancel_url: 'http://localhost:5000/cancel',
        ipn_url: 'http://localhost:5000/ipn',
        shipping_method: 'Courier',
        product_name: 'Computer.',
        product_category: 'Electronic',
        product_profile: 'general',
        cus_name: 'Customer Name',
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
    const sslcommer = new SSLCommerzPayment(process.env.STORE_ID, process.env.STORE_PASSWORD,false) //true for live default false for sandbox
    sslcommer.init(data).then(data => {
        //process the response that got from sslcommerz 
        //https://developer.sslcommerz.com/doc/v4/#returned-parameters
        if(data.GatewayPageURL){
            return res.status(200).redirect(data.GatewayPageURL)
        }
        else{
            return res.status(400).json({
                message: "SSL session was not successful"
            })
        }
    });
});
app.post("/success", (req,res)=>{  
    console.log(req.body)
    res.send(req.body);
    
})
app.post("/failure", (req,res)=>{
    console.log(req.body)
    res.send(req.body);
})
app.post("/cancel", (req,res)=>{
    console.log(req.body)
    res.send(req.body);
})
app.post("/ipn", (req,res)=>{
    console.log(req.body)
    res.send(req.body);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})