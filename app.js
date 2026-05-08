//db
const connectDB = require('./db/connect.js');

const express = require('express');
const cookieParser = require('cookie-parser');

const dotenv = require('dotenv');

const userRoutes = require('./routes/User/user.js');
const internshipRoutes = require('./routes/Internship/internship.js');
const applicationRoutes = require('./routes/Application/application.js');
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/internships', internshipRoutes);
app.use('/api/v1/applications', applicationRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
    });

async function start() {
    try{
    await connectDB(process.env.MONGO_URI)
    app.listen(3005, () => {
        console.log('Example app listening on port 3005!');
        });
    }
    catch (error) {
        console.log(error);
    }
}
start()

