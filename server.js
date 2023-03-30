require('dotenv').config()
// Get dependencies
let express = require('express');
let path = require('path');
let http = require('http');
let mongoose = require('mongoose');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const cronConfig = require("./server/controllers/config");
const scheduler = require("./server/controllers/scheduler");

scheduler.initCrons(cronConfig);

// import the routing file to handle the default (index) route
let index = require('./server/routes/app');

const apartmentRoutes = require('./server/routes/apartments');

const authRoutes = require('./server/routes/auth');

const adminRoutes = require('./server/routes/admin');

let app = express(); // create an instance of express

// Tell express to use the following parsers for POST data
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());

app.use(logger('dev')); // Tell express to use the Morgan logger

// Add support for CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers', 
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});

// Tell express to use the specified director as the
// root directory for your web site
app.use(express.static(path.join(__dirname, 'dist/byui-student-apartment-search')));

// Tell express to map the default route ('/') to the index route
app.use('/', index);
app.use('/api/apartments', apartmentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Tell express to map all other non-defined routes back to the index page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/byui-student-apartment-search/index.html'));
});


// establish a connection to the mongo database
mongoose.connect(process.env.MONGO_URI,
   { useNewUrlParser: true }, (err, res) => {
      if (err) {
         console.log('Connection failed: ' + err);
      }
      else {
         console.log('Connected to database!');
      }
   }
);

// Define the port address and tell express to use this port
const port = process.env.PORT || '3000';
app.set('port', port);

// Create HTTP server.
const server = http.createServer(app);

// Tell the server to start listening on the provided port
server.listen(port, function() {
  console.log('API running on localhost: ' + port)
});
