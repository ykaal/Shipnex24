// Passenger entry point for ShipNex24
// This file is required by Hostinger's Passenger to run the Node.js app

require('dotenv').config();

// Export the Express app
module.exports = require('./server.js');
