#Packages Used:

- sslcommerz@1.6.6
- express
- dotenv
- body-parser

## APIs:
- /init/:amount ---it initializes the transaction

- /success , /failure , /ipn , /cancel: --- post API where SSlcommerz will send a post response to the link specified "data" object with a body containing transaction details.


Reference: https://www.npmjs.com/package/sslcommerz