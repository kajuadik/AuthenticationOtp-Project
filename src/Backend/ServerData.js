const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('path/to/serviceAccountKey.json');

const app = express();

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'YOUR_FIREBASE_DATABASE_URL'
});

// API endpoint for OTP validation
app.post('/validate-otp', async (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;

        // Validate the OTP
        const isValid = validateOtp(phoneNumber, otp);

        // Store the validation result in Firebase
        await admin.database().ref('otpValidations').push({
            phoneNumber,
            otp,
            isValid
        });

        // Send the validation result as the API response
        res.json({ isValid });
    } catch (error) {
        console.error('Error validating OTP:', error);
        res.status(500).json({ error: 'Failed to validate OTP' });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});


function validateOtp(phoneNumber, otp) {
    const axios = require('axios');

    async function sendOtpTOUser(phone) {
        const template = "template _id";
        const apiKey = "api_key";
        const sendotp = "https://api.msg91.com/api/v5/otp?template_id=" + template + "&mobile=" + phone + "&authkey=" + apiKey;
        let request_options1 = {
            method: 'get',
            url: sendotp
        };

        let otpResponse = await axios(request_options1);
        console.log(otpResponse.data)
        return otpResponse.data;
    }
    return otp === '1234';
}
