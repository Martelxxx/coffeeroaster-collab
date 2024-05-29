const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateImage = async (req, res) => {
    
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
}



module.exports = { generateImage };