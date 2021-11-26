require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const initHeaderPassport = require('./config/initHeaderPassport');
const initMongoDb = require('./config/initMongoDb');
const api = require('./routes/api');
const helmet = require('helmet');

const server = express();
const PORT = process.env.PORT || 8000;

const corsOptions ={
    origin: 'http://localhost:3000',     
    optionSuccessStatus: 200,
    methods: 'GET, POST, PUT, PATCH'
  }
server.use(cors(corsOptions));

server.use(express.json())
server.use(express.urlencoded({extended: true}));
server.use(cookieParser());
server.use(helmet());
server.use(passport.initialize());
initHeaderPassport(passport);
initMongoDb(mongoose);
server.use('/api', api);
server.use(function(req, res, next) {
  next(createError(404));
});
server.use(function(err, req, res, next) {
  res.status(err.status || 500).json(err);
});
server.listen(PORT,()=>{
    console.log(`listening on PORT:${PORT}`);
});