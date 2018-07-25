'use strict';

var http = require('http');
const express = require('express');
const path = require('path');
var cors = require('cors')
const app = express();
var oBodyParser = require('body-parser');
var oServer = http.createServer(app);
var oCorsOptions = {
  origin: ['http://how-do-i.app', 'http://localhost:3000']
}
const exec = require('child_process').exec;
const nodemailer = require('nodemailer');

let oTransporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
        user: 'frewin.christopher@gmail.com',
        pass: process.env.GMAIL_PASSWORD
    }
});
let oMailOptions = {
  from: 'frewin.christopher@gmail.com', // sender address
  to: 'frewin.christopher@gmail.com' // list of receivers
};

// user cors options
app.use(cors(oCorsOptions));

// oBodyParser to parse json
app.use(oBodyParser.json());

app.post('/howdoi', (req, res) => {
  console.log(req.body.sInput);
  exec('howdoi ' + req.body.sInput, function(err, stdout, stderr) {
     if (err) {
       console.log(err);
     } else if (stderr) {
       console.log(stderr);
     } else {
       console.log(stdout);
        var oResponse = {
            sResponse: stdout
        };
        res.send(JSON.stringify(oResponse));
     }
   });
});

app.post('/request', (req, res) => {
  console.log(req.body.sRequestLanguage);
  console.log(req.body.sRequestEmail);
  oMailOptions.subject = 'How-do-i.app - New language / framework / tool request!'; // Subject line
  oMailOptions.html = "Requested language / framework / tool: " + req.body.sRequestLanguage + "<br/><br/>Requester: " + req.body.sRequestEmail; // plain text body
  console.log(oMailOptions);
  oTransporter.sendMail(oMailOptions, function (err, info) {
     if (err) {
       console.log(err);
     } else {
       console.log(info);
     }
  });
  res.sendStatus(200);
});

// Serve static assets
app.use(express.static('./build'));

// listening ports - reverse proxyed from nginx how-do-i.app
oServer.listen(8087); // chrisfrew.in productions - how-do-i.app is fixed at 8087