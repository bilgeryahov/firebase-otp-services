const firebaseAdmin = require("firebase-admin");
const otplib = require("otplib");

module.exports = request =>
    new Promise((resolve, reject) => {
        let uEmail = request.body.email;
        let uOTP = request.body.OTP;
        let uUID = null;
        firebaseAdmin.auth().getUserByEmail(uEmail)
            .then(userRecord => {
                uUID = userRecord.uid;
                return firebaseAdmin.database().ref(`/otp-users/${uUID}`).once('value');
            }).then(
                userOTPSecret => userOTPSecret.val()
            ).then(
                userOTPSecretVal => otplib.authenticator.check(uOTP, userOTPSecretVal)
            ).then(success => {
                if (success) return firebaseAdmin.auth().createCustomToken(uUID);
                throw new Error("Unauthorized!");
            }).then(customToken => resolve({
                statusCode: 200,
                jsonResponse: {
                    success: true,
                    message: `${uEmail} successfully authenticated!`,
                    customToken
                }
            })).catch(error => reject({
                statusCode: 400,
                jsonResponse: {
                    success: false,
                    error: error.message
                }
            }));
    });
