const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

const { errorLogger, errorResponder } = require('./middleware/errorMiddleware');
const invalidPathHandler = require('./middleware/invalidPath');

const app = express();

connectDB();

app.use(express.json({ extended: false }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/rides', require('./routes/rides'));
app.use('/api/bookings', require('./routes/bookings'));

app.use(errorLogger);
app.use(errorResponder);
app.use(invalidPathHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));