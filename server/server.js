require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const petRouter = require('./Routes/PetRoute')
const lostPetRouter = require('./Routes/LostPetRoute')
const reportRouter = require('./Routes/ReportRoute')
const AdoptFormRoute = require('./Routes/AdoptFormRoute')
const AdminRoute = require('./Routes/AdminRoute')
const userRoutes = require('./Routes/userRoutes')
const personalityRoutes = require('./Routes/PersonalityRoute')
const cors = require('cors');
const path = require('path');


const app = express();

app.use(cors());

app.use('/Assets', express.static(path.join(__dirname, 'Assets')));

app.use(express.json());


app.use(express.urlencoded({ extended: true }));

app.use('/',lostPetRouter)
app.use('/',petRouter)
app.use('/',reportRouter)
app.use('/form', AdoptFormRoute)
app.use('/admin', AdminRoute)
app.use('/api/users', userRoutes)
app.use('/api', personalityRoutes)



mongoose.connect(process.env.mongooseURL)
    .then(() => {
        console.log('Connected to DB');
        app.listen(process.env.PORT, () => {
            console.log(`Listening on port ${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.error(err);
    })