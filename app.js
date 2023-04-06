const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const request = require("request");
const path = require("path");

const app = express();
const public = path.join(__dirname, "public");

app.use(express.static(public));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);
  const url = "https://us21.api.mailchimp.com/3.0/lists/7cd22195e8";

  const options = {
    method: "POST",
    auth: "kirubel:f717717e4e97c4040af0fbf51ee7d1fa-us21",
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});
app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 300, function () {
  console.log("starting server in 3000");
});

//f717717e4e97c4040af0fbf51ee7d1fa-us21

//list id
//7cd22195e8.
//https://us21.api.mailchimp.com/3.0/lists
