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

// Serve static assets
app.use(express.static('./build'));

// listening ports - reverse proxyed from nginx how-do-i.app
oServer.listen(8087); // chrisfrew.in productions - how-do-i.app is fixed at 8087