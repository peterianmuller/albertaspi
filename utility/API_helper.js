const request = require("request");

module.exports = {
  /*
   ** This method returns a promise
   ** which gets resolved or rejected based
   ** on the result from the API
   */
  make_API_call: function (url) {
    return new Promise((resolve, reject) => {
      let options = {
        uri: url,
        headers: {
          Authorization: process.env.KEY || KEY,
        },
        json: true,
      };
      request(options, (err, res, body) => {
        if (err) reject(err);
        resolve(body);
      });
    });
  },
};
