// imports
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();

const coffeeRouter = require('./src/controllers/coffees');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });
  mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected!');
});

const cors = require('cors');

// middleware

app.use(cors());
app.use(express.json());
app.use('/coffees', coffeeRouter);

app.listen(3001, () => {
    console.log('Server is running...');
});
