// imports
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const coffeeRouter = require('./src/controllers/coffees');
const imageRouter = require('./src/controllers/images');

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
app.use(bodyParser.json());

// AI image generation
app.post('/generate-image', async (req, res) => {
  try {
      const { prompt } = req.body;
      const imageResponse = await openai.images.generate({
          model: "dall-e-3",
          prompt: prompt,  // Use the user's question as the prompt for image generation
          n: 1,
          size: "1024x1024"
      });

      const imageUrl = imageResponse.data[0].url;
      res.json({ image: imageUrl });
      console.log(imageUrl);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});


app.listen(3009, () => {
  console.log('Server is running...');
});
