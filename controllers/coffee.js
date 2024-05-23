// imports
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const coffee = await Coffee.create(req.body);
        res.status(200).json(coffee);
    } catch (error) {
        res.status(400).json(error);
    }
}
);

//Read - GET /coffees
router.get('/', async (req, res) => {
    try {
        const foundCoffee = await Coffee.find({});
        res.status(200).json(foundCoffee);
    } catch (error) {
        res.status(400).json(error);
    }
}
);

//Read - GET /coffees/:id
router.get('/:id', async (req, res) => {
    try {
        const foundCoffee = await Coffee.findById(req.params.id);
        res.status(200).json(foundCoffee);
    } catch (error) {
        res.status(400).json(error);
    }
}
);

//Delete - DELETE /coffees/:id
router.delete('/:id', async (req, res) => {
    try {
        const deletedCoffee = await Coffee.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedCoffee);
    } catch (error) {
        res.status(400).json(error);
    }
}
);

//Update - PUT /coffees/:id
router.put('/:id', async (req, res) => {
    const coffeeId = req.params.id;
    try {
        const updatedCoffee = await Coffee.findByIdAndUpdate(coffeeId, req.body, { new: true });
        if (updatedCoffee) {
            res.status(200).json(updatedCoffee);
        } else {
            res.status(404).json('Coffee not found');
        }
    } catch (error) {
        res.status(400).json(error);
    };
});

module.exports = router;