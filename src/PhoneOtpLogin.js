import React, { useState } from 'react';
import firebase from './firebase';
import axios from 'axios';

const PhoneOtpLogin = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [verificationId, setVerificationId] = useState(null);

    const handleSendOtp = async () => {
        try {
            const confirmationResult = await firebase.auth().signInWithPhoneNumber(phoneNumber);
            setVerificationId(confirmationResult.verificationId);
        } catch (error) {
            console.log('Error sending OTP:', error);
        }
    };




    const handleSignInWithOtp = async () => {
        try {
            const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode);
            await firebase.auth().signInWithCredential(credential);
            console.log('Successfully logged in with OTP.');

            // Call the HTTP API to store the data in Firebase
            const response = await axios.post('YOUR_API_ENDPOINT', {
                phoneNumber,
                otp: verificationCode,
            });

            console.log('Data stored in Firebase:', response.data);
        } catch (error) {
            console.log('Error signing in with OTP:', error);
        }
    };


    return (
        <div>
            <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            <button onClick={handleSendOtp}>Send OTP</button>

            <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
            <button onClick={handleSignInWithOtp}>Sign In with OTP</button>
        </div>
    );
};

export default PhoneOtpLogin;
