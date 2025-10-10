// Entine Store Donation Backend Server
const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
const paypal = require('@paypal/checkout-server-sdk');
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
const YOUR_PHONE_NUMBER = '+19287161710';             // Your personal phone number

// PayPal Configuration
const PAYPAL_CLIENT_ID = 'your_paypal_client_id';     // Replace with your PayPal Client ID
const PAYPAL_CLIENT_SECRET = 'your_paypal_secret';    // Replace with your PayPal Client Secret

// CashApp Information
const CASHAPP_TAG = '@detachedguf';                   // Your CashApp tag

// Initialize Twilio
const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Initialize PayPal
const environment = new paypal.core.SandboxEnvironment(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET);
const client = new paypal.core.PayPalHttpClient(environment);

// ===============================
// ROUTES
// ===============================

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// Create PayPal payment
app.post('/api/create-payment', async (req, res) => {
    try {
        const { amount, donorName, donorEmail, message } = req.body;
        
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: amount.toString()
                },
                description: `Entine Quest Donation from ${donorName}`
            }],
            application_context: {
                brand_name: 'Entine Store',
                landing_page: 'BILLING',
                user_action: 'PAY_NOW',
                return_url: `${req.protocol}://${req.get('host')}/api/payment-success`,
                cancel_url: `${req.protocol}://${req.get('host')}/api/payment-cancel`
            }
        });

        const order = await client.execute(request);
        
        // Store donation info temporarily (in production, use a database)
        global.pendingDonations = global.pendingDonations || {};
        global.pendingDonations[order.result.id] = {
            donorName,
            donorEmail,
            message,
            amount
        };
        
        res.json({
            id: order.result.id,
            status: order.result.status,
            links: order.result.links
        });
        
    } catch (error) {
        console.error('PayPal payment creation error:', error);
        res.status(500).json({ error: 'Failed to create payment' });
    }
});

// Capture PayPal payment
app.post('/api/capture-payment/:orderID', async (req, res) => {
    try {
        const orderID = req.params.orderID;
        const request = new paypal.orders.OrdersCaptureRequest(orderID);
        request.requestBody({});
        
        const capture = await client.execute(request);
        const donationInfo = global.pendingDonations[orderID];
        
        if (capture.result.status === 'COMPLETED' && donationInfo) {
            // Send SMS notification
            await sendSMSNotification(donationInfo);
            
            // Clean up pending donation
            delete global.pendingDonations[orderID];
            
            res.json({
                success: true,
                captureID: capture.result.id,
                status: capture.result.status
            });
        } else {
            res.status(400).json({ error: 'Payment capture failed' });
        }
        
    } catch (error) {
        console.error('PayPal payment capture error:', error);
        res.status(500).json({ error: 'Failed to capture payment' });
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

💰 Funds will be transferred to your CashApp @detachedguf within 1-2 business days.

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
        // 2. Transfer funds to your CashApp account
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
   - Set up automatic transfer from PayPal to CashApp

💡 For now, the system will simulate payments and send SMS notifications
   when properly configured!
`);

module.exports = app;
