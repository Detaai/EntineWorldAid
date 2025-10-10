// Entine Store Donation Backend Server
const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
const stripe = require('stripe');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('src'));

// ===============================
// CONFIGURATION (You need to set these up)
// ===============================

// Twilio Configuration (for SMS)
const TWILIO_ACCOUNT_SID = 'your_twilio_account_sid'; // Replace with your Twilio Account SID
const TWILIO_AUTH_TOKEN = 'your_twilio_auth_token';   // Replace with your Twilio Auth Token
const TWILIO_PHONE_NUMBER = 'your_twilio_phone';      // Replace with your Twilio phone number
const YOUR_PHONE_NUMBER = '+1234567890';             // Replace with your personal phone number

// Stripe Configuration
const STRIPE_SECRET_KEY = 'sk_test_your_stripe_secret_key';     // Replace with your Stripe Secret Key
const STRIPE_PUBLISHABLE_KEY = 'pk_test_your_stripe_publishable_key'; // Replace with your Stripe Publishable Key

// Bank Account Information
const BANK_ACCOUNT_INFO = 'Direct deposit to your linked bank account';           // Your bank account info

// Initialize Twilio
const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Initialize Stripe
const stripeInstance = stripe(STRIPE_SECRET_KEY);

// ===============================
// ROUTES
// ===============================

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// Create Stripe payment intent
app.post('/api/create-payment', async (req, res) => {
    try {
        const { amount, donorName, donorEmail, message } = req.body;
        
        const paymentIntent = await stripeInstance.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: 'usd',
            metadata: {
                donorName: donorName,
                donorEmail: donorEmail,
                message: message || 'No message provided'
            },
            description: `Entine Quest Donation from ${donorName}`
        });
        
        // Store donation info temporarily (in production, use a database)
        global.pendingDonations = global.pendingDonations || {};
        global.pendingDonations[paymentIntent.id] = {
            donorName,
            donorEmail,
            message,
            amount
        };
        
        res.json({
            client_secret: paymentIntent.client_secret,
            publishable_key: STRIPE_PUBLISHABLE_KEY
        });
        
    } catch (error) {
        console.error('Stripe payment creation error:', error);
        res.status(500).json({ error: 'Failed to create payment' });
    }
});

// Confirm Stripe payment
app.post('/api/confirm-payment/:paymentIntentId', async (req, res) => {
    try {
        const paymentIntentId = req.params.paymentIntentId;
        const paymentIntent = await stripeInstance.paymentIntents.retrieve(paymentIntentId);
        const donationInfo = global.pendingDonations[paymentIntentId];
        
        if (paymentIntent.status === 'succeeded' && donationInfo) {
            // Send SMS notification
            await sendSMSNotification(donationInfo);
            
            // Clean up pending donation
            delete global.pendingDonations[paymentIntentId];
            
            res.json({
                success: true,
                paymentIntentId: paymentIntent.id,
                status: paymentIntent.status
            });
        } else {
            res.status(400).json({ error: 'Payment confirmation failed' });
        }
        
    } catch (error) {
        console.error('Stripe payment confirmation error:', error);
        res.status(500).json({ error: 'Failed to confirm payment' });
    }
});

// Send SMS notification function
async function sendSMSNotification(donationInfo) {
    try {
        const { donorName, amount, message } = donationInfo;
        
        const smsBody = `🎉 New Entine Quest Donation!
        
Donor: ${donorName}
Amount: $${amount}
Message: "${message || 'No message provided'}"

💰 Funds will be deposited directly to your bank account within 2 business days.

✨ Another supporter joins the quest! ⚔️`;

        await twilioClient.messages.create({
            body: smsBody,
            from: TWILIO_PHONE_NUMBER,
            to: '+19287161710'
        });
        
        console.log('✅ SMS notification sent successfully');
        
    } catch (error) {
        console.error('❌ SMS sending error:', error);
    }
}

// Handle donation form submission (alternative to PayPal)
app.post('/api/donate', async (req, res) => {
    try {
        const { amount, donorName, donorEmail, message, paymentMethod } = req.body;
        
        // Validate the donation
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid donation amount' });
        }
        
        if (!donorEmail || !donorEmail.includes('@')) {
            return res.status(400).json({ error: 'Invalid email address' });
        }
        
        // Send SMS notification
        await sendSMSNotification({ donorName, amount, message });
        
        // In a real implementation, you would:
        // 1. Process the payment through your payment processor
        // 2. Transfer funds to your private account
        // 3. Store donation records in a database
        // 4. Send confirmation email to donor
        
        res.json({
            success: true,
            message: 'Donation processed successfully',
            donationId: `ENTINE_${Date.now()}`,
            amount: amount
        });
        
    } catch (error) {
        console.error('Donation processing error:', error);
        res.status(500).json({ error: 'Failed to process donation' });
    }
});

// Payment success redirect
app.get('/api/payment-success', (req, res) => {
    res.redirect('/?payment=success');
});

// Payment cancel redirect
app.get('/api/payment-cancel', (req, res) => {
    res.redirect('/?payment=cancel');
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Entine Store Donation Server is running!' });
});

// ===============================
// SERVER STARTUP
// ===============================

app.listen(PORT, () => {
    console.log(`🏰 Entine Store Donation Server running on port ${PORT}`);
    console.log(`📱 Make sure to configure your Twilio and PayPal credentials!`);
    console.log(`🌐 Visit: http://localhost:${PORT}`);
});

// ===============================
// SETUP INSTRUCTIONS
// ===============================

console.log(`
🚀 SETUP INSTRUCTIONS:

1. Twilio Setup (for SMS):
   - Create account at https://www.twilio.com/
   - Get your Account SID, Auth Token, and phone number
   - Replace the placeholder values in this file

2. PayPal Setup (for payments):
   - Create developer account at https://developer.paypal.com/
   - Create a new app to get Client ID and Secret
   - Replace the placeholder values in this file

3. Install dependencies:
   npm install express cors twilio @paypal/checkout-server-sdk

4. For production:
   - Use environment variables for sensitive data
   - Use a real database instead of global variables
   - Set up proper error handling and logging
   - Configure HTTPS
   - Set up automatic transfer from PayPal to your private account

💡 For now, the system will simulate payments and send SMS notifications
   when properly configured!
`);

module.exports = app;
