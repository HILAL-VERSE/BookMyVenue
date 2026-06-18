require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

const healthRouter = require('./routes/health.routes');
const dbRoutes = require('./routes/dbRoutes');
const getVenuesRouter = require('./routes/getVenues');

app.use(cors())
app.use('/health', healthRouter);
app.use('/db', dbRoutes);
app.use('/venues', getVenuesRouter);

app.get('/', (req, res) => {
    res.send('Hello, World! Your Express server is running.');
});

app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});