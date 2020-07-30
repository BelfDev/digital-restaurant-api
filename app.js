const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize } = require('sequelize');

const dummyRouter = require('./routes/dummyRouter');

const app = express();
app.use(bodyParser.json());
app.use(dummyRouter);

app.listen(8080);