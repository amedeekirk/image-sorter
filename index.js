const env = require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const history = require('connect-history-api-fallback');


const app = express();
const port = process.env.PORT || 8000;

// Enable CORS
app.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Utilize body-parser middleware to easily handle JSON
app.use(bodyParser.json({limit: '2mb'}));

app.use(history());

// Handle routes
app.use('/', routes);
app.use(express.static(__dirname + '/client/dist'));

// Handles non-existent routes
app.use('*', function (req, res) {
    res.status(404).json({
        error: "Requested resource " + req.originalUrl + " does not exist"
    });
});

// Static serving

// Start server
app.listen(port, function() {
    console.log("== Server is running on port", port);
});