const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create a payment session
exports.createCheckoutSession = async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: req.body.items,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/payment/failure`,
        });
        res.json({ url: session.url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Handle successful payment session
exports.paymentSuccess = async (req, res) => {
    const { session_id } = req.query;
    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);
        if (session.payment_status === 'paid') {
            // Handle post-payment logic here (e.g., update order status)
            res.json({ success: true, session });
        } else {
            res.status(400).json({ success: false, message: 'Payment not completed.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Handle failed/cancelled payment session
exports.paymentFailure = (req, res) => {
    res.status(200).json({ success: false, message: 'Payment was cancelled or failed.' });
};