// module dependencies
var express = require("express");
var api_helper = require("./utility/API_helper");
var router = express.Router();
var bodyParser = require("body-parser");
var favicon = require("serve-favicon");
var path = require("path");
const dotenv = require("dotenv");
dotenv.config();

// get port from environment and store in Express
var app = express();

// set the view engine to ejs
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(favicon(path.join(__dirname, "favicon.ico")));


app.get("/getSPIAspects", (req, res) => {
  // api_helper.make_API_call("https://data.socialprogress.org/api/3/action/datastore_search?resource_id=2f2757d3-7852-4d32-9caa-3ae977863ebe")
  api_helper
    .make_API_call(
      "https://data.socialprogress.org/datastore/dump/83981c7a-ff05-4722-b1dc-7d75c35e08a1?format=json"
    )
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.send(error);
    });
});

//  original
app.get("/", function (req, res) {
  let fullData = [];
  api_helper
    .make_API_call(
      "https://data.socialprogress.org/dataset/d2f64082-e2ad-4897-9d7f-32fa973a62b5/resource/0375fe2a-7881-4097-9721-8d9dbe94a133/download/tracts.geojson"
    )
    // api_helper.make_API_call("https://data.socialprogress.org/datastore/dump/742c3279-41da-43aa-abfe-5780c676c3b8?format=json")
    .then((response) => {
      // geojson is ok
      fullData.push('response is', response);
      api_helper
        .make_API_call(
          "https://data.socialprogress.org/datastore/dump/40fa59e4-2404-4a02-abaa-9d8b9692194a?format=json"
        )
        // api_helper.make_API_call("https://data.socialprogress.org/datastore/dump/742c3279-41da-43aa-abfe-5780c676c3b8?format=json")
        .then((geogResponse) => {
          // geog response is ok
          fullData.push(geogResponse);
          api_helper
            .make_API_call(
              "https://data.socialprogress.org/datastore/dump/c354bade-b578-42bd-9428-858f206bc396?format=json"
            )
            // api_helper.make_API_call("https://data.socialprogress.org/datastore/dump/742c3279-41da-43aa-abfe-5780c676c3b8?format=csv")
            .then((spiResponse) => {
              // spi response is ok

              fullData.push(spiResponse);
              // res.json(response)
              api_helper
                .make_API_call(
                  "https://data.socialprogress.org/datastore/dump/0e7c129f-b10a-40c2-8673-6a3ed291932b?format=json"
                )
                .then((aspects) => {

                  // res.json(aspects);
                  res.render("pages/index", {
                    lat: 32.298756,
                    lon: -90.184807,
                    coords: response,
                    geography: geogResponse,
                    spi: spiResponse,
                    spiAspects: aspects,
                  });
                })
                .catch((error) => {
                  res.send(error);
                });
            })
            .catch((error) => {
              res.send(error);
            });
        })
        .catch((error) => {
          res.send(error);
        });
    })
    .catch((error) => {
      res.send(error);
    });
});

// Get port from environment and store in Express
var port = process.env.PORT || 8080;
app.listen(port);
