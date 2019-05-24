module.exports = {
    promisify: func => (...args) =>
        new Promise((resolve, reject) =>
            func(...args, (error, data) => {
                if (error) return reject(error);
                return resolve(data);
            }))
};
