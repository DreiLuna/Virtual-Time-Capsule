import express from 'express';
const app = express();

// Import the route files
import userRoutes from './routes/users.js'

app.use(express.json());
app.use('/api/users', userRoutes);

// Run backend
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Running on ${port}...`));