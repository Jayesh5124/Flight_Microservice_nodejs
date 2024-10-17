const express = require('express')  
const mongooes = require('mongoose')
const axios = require('axios')

const app = express()

app.use(express.json())

const port = 3003

// Connect to MongoDB

mongooes.connect('mongodb://127.0.0.1:27017/passengerdb', { useNewUrlParser: true, useUnifiedTopology: true })

const passenger=mongooes
    .model('passengers', {
        pass_id: Number,
        name: String,
        flt_id: Number
    })  
    
// Get all passengers

app.get('/passengers', async (req, res) => {
    try {
        const passengers = await passenger.find({})
        res.json(passengers)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})
//get all  passengers for flt_id

app.get('/passengers/flt/:id', async (req, res) => {
    try {
        const passengers = await passenger.find({ flt_id: req.params.id })
        res.json(passengers)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})


// Get a single passenger

app.get('/passengers/:id', getPassenger, (req, res) => {
    res.json(res.passenger)
})

async function getPassenger(req, res, next) {
    let passenger
    try {
        passenger = await passenger.findById(req.params.id)
        if (passenger == null) {
            return res.status(404).json({ message: 'Cannot find passenger' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.passenger = passenger
    next()
}

// Add a new passenger

app.post('/passengers', async (req, res) => {
    const { pass_id, name, flt_id } = req.body;

    try {
        // Check if the flight exists
        const flightRes = await axios.get(`http://localhost:3002/flights/${flt_id}`);
        
        if (!flightRes.data) {
            return res.status(404).json({ error: 'Flight not available' });
        }

      
        // Create a new passenger instance
        const newPassenger = new passenger({
            pass_id,
            name,
            flt_id
        });

        // Save the new passenger to the database
        await newPassenger.save();

        // Respond with the created passenger
        res.status(201).json(newPassenger);
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(400).json({ message: err.message });
    }
});


// app.listen()

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})