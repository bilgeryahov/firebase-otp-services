const firebaseFunctions = require("firebase-functions");
const firebaseAdmin = require("firebase-admin");
const cors = require("cors")({
    origin: true
});

const register = require("./src/register");
const authenticate = require("./src/authenticate");

function initializeFirebaseAdminSDK(firebaseAdminSDKConfig) {
    firebaseAdminSDKConfig.private_key = firebaseAdminSDKConfig.private_key
        .replace(new RegExp("space", "g"), " ")
        .replace(/\\n/g, "\n");
    firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(firebaseAdminSDKConfig),
        databaseURL: "https://fir-otp-47874.firebaseio.com"
    });
}

initializeFirebaseAdminSDK(firebaseFunctions.config().admin);

exports.register = firebaseFunctions.https.onRequest((request, response) =>
    cors(request, response, () => handleHTTPS(request, response, register)));

exports.authenticate = firebaseFunctions.https.onRequest((request, response) =>
    cors(request, response, () => handleHTTPS(request, response, authenticate)));

function handleHTTPS(request, response, handler) {
    return handler(request)
        .then(data => response.status(data["statusCode"]).json(data["jsonResponse"]))
        .catch(error => response.status(error["statusCode"]).json(error["jsonResponse"]));
}
