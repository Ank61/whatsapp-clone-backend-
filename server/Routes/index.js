const express = require('express');
const userRoutes = require("../Routes/User/user");

function setupRoutes(app) {
  app.use('/user', userRoutes);
}

module.exports = setupRoutes;