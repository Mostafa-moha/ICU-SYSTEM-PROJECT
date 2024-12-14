const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');


// Middleware imports
const { authenticateJWT } = require('./middleware/authMiddleware');
const { errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const hospitalRoutes = require('./routes/hospitalRoutes');
const icuRoutes = require('./routes/icuRoutes');
const patientRoutes = require('./routes/patientRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const userRoutes = require('./routes/userRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes (with optional authentication where required)
app.use('/api/hospitals', hospitalRoutes); // Example: Public route
app.use('/api/icu', authenticateJWT, icuRoutes); // Example: Authenticated route
app.use('/api/patients', authenticateJWT, patientRoutes); // Example: Authenticated route
app.use('/api/reservations', authenticateJWT, reservationRoutes); // Example: Authenticated route
app.use('/api/users', authenticateJWT, userRoutes); // Example: Authenticated route

// Base route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Hospital Management API!' });
});

// Error handling middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
