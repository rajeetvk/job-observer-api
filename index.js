require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./services/jobScraper');


const subscriptionRoutes = require('./routes/subscriptionRoutes');
const jobRoutes = require('./routes/jobRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

app.use('/api', authRoutes);

app.use('/api', subscriptionRoutes);
app.use('/api', jobRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
