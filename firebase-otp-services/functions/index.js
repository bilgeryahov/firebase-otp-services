"use strict"

const firebaseFunctions = require("firebase-functions");
const firebaseAdmin = require("firebase-admin");
const { execSync } = require("child_process");
const cors = require("cors")({
    origin: true,
});

const helloWorld = require("./src/samples/hello-world");
const adminSample = require("./src/samples/admin-sample");

function initializeFirebaseAdminSDK(firebaseAdminSDKConfig) {
    firebaseAdminSDKConfig.private_key = firebaseAdminSDKConfig.private_key
        .replace(new RegExp("space", "g"), " ")
        .replace(/\\n/g, "\n");
    firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(firebaseAdminSDKConfig),
        databaseURL: "https://fir-otp-47874.firebaseio.com"
    });
}

if (process.env.NODE_ENV === "production") {
    initializeFirebaseAdminSDK(firebaseFunctions.config().admin);
} else if (process.env.NODE_ENV === "development") {
    setTimeout(() => {
        try {
            let config = execSync("firebase functions:config:get");
            config = JSON.parse(config);
            if (!config.admin) {
                console.error("#index.js: No config set for Firebase Admin SDK!");
                return;
            }
            initializeFirebaseAdminSDK(config.admin);
        } catch (exc) {
            console.error(`#index.js: Cannot run Firebase Admin SDK for ${process.env.NODE_ENV}!`);
            console.error((exc));
        }
    }, 10000);
} else {
    console.error("#index.js: NODE_ENV has not been set correctly!");
}

exports.helloWorld = firebaseFunctions.https.onRequest((request, response) =>
    cors(request, response, () => handleHTTPS(request, response, helloWorld)));

exports.adminSample = firebaseFunctions.https.onRequest((request, response) =>
    cors(request, response, () => handleHTTPS(request, response, adminSample)));

function handleHTTPS(request, response, handler) {
    return handler(request)
        .then((data) => response.status(data["statusCode"]).json(data["jsonResponse"]))
        .catch((error) => response.status(error["statusCode"]).json(error["jsonResponse"]));
}
