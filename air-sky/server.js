const express=require('express');
const moongose=require('mongoose');

const app=express();
const port=3001;


app.use(express.json());
moongose.connect('mongodb://127.0.0.1:27017/airskydb',{useNewUrlParser:true,useUnifiedTopology:true});

const airdb=new moongose.model('airdbs',{
    flt_id:Number,
    flt_type:String,
    flt_capacity:Number,
    flt_count:Number
});


app.get('/allFlight', async (req, res) => {
    try {
      const flights = await airdb.find();
      res.json(flights);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching flights' });
    }
  });
app.get('/flight/:id', async (req, res) => {
    try {
        const flightId = parseInt(req.params.id, 10); // Convert the ID from the URL to an integer
    if (isNaN(flightId)) {
      return res.status(400).json({ error: 'Invalid flight ID' });
    }

    // Find the flight by the custom field flt_id
    const flight = await airdb.findOne({ flt_id: flightId });
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }
     
      res.json(flight);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching flight' });
    }
  });   
  app.post('/addFlight', async (req, res) => {
    try {
      const flight = new airdb(req.body);
      await flight.save();
      res.json({ message: 'Flight added successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error adding flight' });
    }
  });
  app.put('/updateFlight/:id', async (req, res) => {
    try {
        const flightId = parseInt(req.params.id, 10); // Convert the ID from the URL to an integer
        if (isNaN(flightId)) {
          return res.status(400).json({ error: 'Invalid flight ID' });
        }
    
        // Find the flight by the custom field flt_id
        const flight = await airdb.findOne({ flt_id: flightId });
      if (!flight) {
        return res.status(404).json({ error: 'Flight not found' });
      }
      
      // Update the flight with the provided data   
      flight.set(req.body);
      await flight.save();
      
      res.json({ message: 'Flight updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error updating flight' });
    }
  });
  app.delete('/deleteFlight/:id', async (req, res) => {
    try {
      const flight = await airdb.findByIdAndDelete(req.params.id);
      if (!flight) {
        return res.status(404).json({ error: 'Flight not found' });
      }
      res.json({ message: 'Flight deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting flight' });
    }
  });   
  app.listen(port, () => console.log(`Server running on port ${port}`));
