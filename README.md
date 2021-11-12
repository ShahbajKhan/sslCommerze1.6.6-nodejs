# Packages Used:

- sslcommerz@1.6.6
- express
- cors
- dotenv
- uuid

## APIs:
- /init ---it initializes the transaction. It is a post method which will receive product and customer info for initiating transaction. It will send the gatewayURL as response to the client. It will initially insert the "productInfo" object into the database. 

- /success , /failure , /ipn , /cancel: --- post API where SSlcommerz will send a post response to the link specified in the "productInfo" object with a body containing transaction details. The success method will edit the order payment info and insert the val_id provided by sslcommerz into the collection if the transaction is successful. The order will be removed from the database if the customer closes the gateway or if the payment fails. Then they  will redirect to the specified pages inside res.redirect().

- /orders/:tran_id --- API for finding specific order.

- /validate ---- It will find out the order info from the collection with the help of tran_id and match the val_id sent from the client side. If it matches then the paymentStatus will be confirmed. else it will not allow the customer to confirm the paymentStaus. This can be used to generate payment receipt.

Open sandbox account and edit ipn settings(from 0:00 to 8:30 mins of this video): https://www.youtube.com/watch?v=RXXWLj6S704  

Reference: https://www.npmjs.com/package/sslcommerz