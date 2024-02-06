require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const imageRoutes = require('./routes/image');
const testRoutes = require('./routes/test');
const mailRoutes = require('./routes/mails');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
});

app.use('/image', imageRoutes);
app.use('/mail', mailRoutes);

app.use("/", testRoutes);

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to database');
    app.listen(PORT, () => {
        console.log('Server running on port ' + PORT);
    });
}).catch((err) => {
    console.log('Connection failed');
});