require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000; // 3000 is the default port

const userRoutes = require('./routes/user.routes.js');
const authRoutes = require('./routes/auth.routes.js');

app.use(cors());
app.use(express.json());

// Routes 
app.use('/user', userRoutes);   
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {    
    console.log(`Server is running on port ${port}`);
});

