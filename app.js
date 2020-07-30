const express = require('express');
const bodyParser = require('body-parser');
const { sequelize }= require('./config/database');

const dummyRouter = require('./routes/dummyRouter');

const app = express();

app.use(bodyParser.json());
app.use(dummyRouter);

app.listen(8080);

async function test() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

test();