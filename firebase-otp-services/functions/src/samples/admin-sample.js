"use strict"

const firebaseAdmin = require('firebase-admin');

module.exports = (request) =>
    new Promise((resolve, reject) => {
        try {
            firebaseAdmin.auth().getUserByEmail(request.body.email)
                .then((userRecord) =>
                    resolve({
                        statusCode: 200,
                        jsonResponse: {
                            success: true,
                            uid: userRecord.uid.substr(1, 3)
                        }
                    }))
                .catch(error => onError(reject, error.message || error.code || "error"));
        }
        catch (exc) {
            return onError(reject, exc.message || exc.code || "error");
        }
    });

function onError(reject, error) {
    return reject({
        statusCode: 400,
        jsonResponse: {
            success: false,
            error
        }
    });
}
