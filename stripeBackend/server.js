const express = require('express');
const stripe = require('stripe')('sk_test_51P6Feq066R1dyNUymbqQ68IwPt2DhbwJUmTQhZlfkvWwzpF32rdXFR3XwnkHiGESWA4HN8tgxdZJ57V3jjxxaOcJ00vnPnLAzN'); // Replace with your Stripe secret key
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.post('/create-payment-intent', async (req, res) => {
    const { paymentMethodId, amount, currency, customerEmail } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method: paymentMethodId,
            receipt_email: customerEmail,
            description: 'Purchase description',
            confirm: true,
            payment_method_types: ['card'], // Specify card explicitly
        });

        res.send({
            success: true,
            paymentIntent,
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            error: error.message,
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// to start the backend : 
// node server.js
