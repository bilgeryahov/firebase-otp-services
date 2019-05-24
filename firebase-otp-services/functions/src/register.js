const firebaseAdmin = require("firebase-admin");
const crypto = require("crypto");
const otplib = require("otplib");
const qrcode = require("qrcode");
const utilities = require('./shared/utilities');

module.exports = request =>
    new Promise((resolve, reject) => {
        let uEmail = request.body.email;
        let uDisplayName = request.body.displayName;
        let otpSecret = otplib.authenticator.generateSecret();
        firebaseAdmin.auth().createUser({
            email: uEmail,
            displayName: uDisplayName,
            password: crypto.randomBytes(20).toString('hex'),
            disabled: false
        }).then(userRecord =>
            firebaseAdmin.database().ref(`/otp-users/${userRecord.uid}`).set(otpSecret)
        ).then(() =>
            utilities.promisify(qrcode.toDataURL)(otplib.authenticator.keyuri(uEmail, 'Firebase OTP', otpSecret))
        ).then(qrData => resolve({
            statusCode: 201,
            jsonResponse: {
                success: true,
                message: `${uEmail} successfully registered!`,
                qrData
            }
        })).catch(error => reject({
            statusCode: 400,
            jsonResponse: {
                success: false,
                error: error.message
            }
        }));
    });
