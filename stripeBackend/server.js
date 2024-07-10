const express = require('express');
const Stripe = require('stripe');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const stripe = Stripe('pk_test_51P6Feq066R1dyNUyGmP7XnDJ6lntAX6FsDOmy39mkxGPXPRMm4RlN3l83dYyRW5YbB5wtE5sKFBC2mY9WyvOs1Na00ttd93Jt2');

app.use(bodyParser.json());
app.use(cors());

app.post('/create-payment-intent', async (req, res) => {
    const { amount, currency, customerEmail, paymentMethodId } = req.body;

    try {
        let paymentIntent;

        if (paymentMethodId) {
            paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency,
                payment_method: paymentMethodId,
                receipt_email: customerEmail,
                confirm: true
            });
        } else {
            paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency,
                receipt_email: customerEmail,
            });
        }

        res.send({
            success: true,
            paymentIntent
        });
    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            error: error.message
        });
    }
});

app.listen(3000, () => console.log('Server is running on port 3000'));
