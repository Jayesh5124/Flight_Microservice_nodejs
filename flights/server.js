const express = require('express')  //  eslint-disable-line no- infinite            
const mongoose = require('mongoose') // eslint-disable-
const axios = require('axios');

const port = 3002;
mongoose.connect('mongodb://127.0.0.1:27017/flightdb', { useNewUrlParser: true, useUnifiedTopology: true }) // eslint-disable-line no-unused-vars
const app = express()   

app.use(express.json())  //  eslint-disable-line no-unused-vars

const fldb=new mongoose.model('fldbs',{
    flt_id:Number,
    start:String,
    dest:String,
    date:Date,
    price:Number,
    seat_avail:Number
})

app.post('/flight',async (req,res)=>{
    const { flt_id,start,dest,date,price,seat_avail } = req.body;
    
    try{
        const flightRes = await axios.get(`http://localhost:3001/flight/${flt_id}`);
        
        if (!flightRes.data || flightRes.data.flt_count === 0) {
            return res.status(404).json({ error: 'Flight not available' });
        }

        const newFlight = new fldb({ flt_id, start, dest, date, price,seat_avail });
        await newFlight.save();
        res.status(201).json({ message: 'Flight added successfully' });

        await axios.put(`http://localhost:3001/updateFlight/${flt_id}`, {
            flt_count: flightRes.data.flt_count - 1
        });



    }
    catch(err){
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: 'An error occurred while adding the flight' });
    }
});
       


app.get('/flights/:id',(req,res)=>{
    fldb.findById(req.params.id).then(flight=>res.send(flight)).catch(err=>res.send(err))
})

app.get('/flights',(req,res)=>{
    fldb.find().then(flights=>res.send(flights)).catch(err=>res.send(err))
})

app.put('/flights/:id',(req,res)=>{
    fldb.findByIdAndUpdate(req.params.id,req.body).then(()=>res.send('Flight updated')).catch(err=>res.send(err))
})

app.delete('/flights/:id',(req,res)=>{
    fldb.findByIdAndDelete(req.params.id).then(()=>res.send('Flight deleted')).catch(err=>res.send(err))
})

app.listen(port,()=>console.log(`Server is running on port ${port}`)) // eslint-disable-line no-console-log
