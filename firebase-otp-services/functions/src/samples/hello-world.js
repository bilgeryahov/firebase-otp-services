"use strict"

module.exports = (request) =>
    Promise.resolve({
        statusCode: 200,
        jsonResponse: {
            success: true,
            message: request.body.message || "Hello World!"
        }
    });
