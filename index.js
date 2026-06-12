require('dotenv').config();
const express = require('express');
const cors = require('cors');

const subscriptionRoutes = require('./routes/subscriptionRoutes');
const jobRoutes = require('./routes/jobRoutes');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', subscriptionRoutes);
app.use('/api', jobRoutes);

app.get('/', (req, res) => {
    res.send('Job Alert Platform API is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
