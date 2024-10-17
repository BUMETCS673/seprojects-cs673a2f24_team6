const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const router = require('./router');


app.use(express.json());

app.use(cors({
    origin: '*'
}));

app.get('/', (req, res) => { res.json({ test: "success" }) });

app.use('/api', router);

// Centralized error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

//Updated to use .env file's PORT, if not found use 3000 as default
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});