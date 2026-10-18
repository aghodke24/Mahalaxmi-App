// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const cors = require('cors');

// dotenv.config();
// const app = express();

// app.use(express.json());
// app.use(cors());

// // Connect Database
// // mongoose.connect(process.env.MONGO_URI)
// mongoose.connect('mongodb://127.0.0.1:27017/ecommerce', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
//     .then(() => console.log('MongoDB Connected Successfully'))
//     .catch((err) => console.log('MongoDB Connection Error: ', err));

// // Register Routes
// app.use('/api/users', require('./routes/authRoutes'));
// app.use('/api/products', require('./routes/productRoutes'));
// app.use('/api/bookings', require('./routes/serviceRoutes'));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// Connect Database
mongoose.connect('mongodb://127.0.0.1:27017/ecommerce', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch((err) => console.log('MongoDB Connection Error: ', err));

// Register Routes
app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/bookings', require('./routes/serviceRoutes'));

// Serve Frontend in Production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));