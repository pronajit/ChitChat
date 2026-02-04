const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectDb = require('./Utils/dbconfig');
const dotenv = require('dotenv');
const messageRoutes = require('./routes/message.routes');
const groupRoutes = require('./routes/group.routes');
const userRoutes = require('./routes/user.routes');
const otpRoutes = require('./routes/otp.routes');

dotenv.config();

const {app , server} = require('./Socket');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use('/api/messages', messageRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/user', userRoutes);
app.use('/api/otp', otpRoutes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, ()=>{
    connectDb();
    console.log(`Server is running on port ${PORT}`);
})
