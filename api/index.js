const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")
const userRoute = require("./routes/user.route.js")
const authRoute = require("./routes/auth.route.js")
const updateRoute = require("./routes/update.route.js")
dotenv.config();

const port = 3000
const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));


app.use('/', userRoute);
app.use('/', authRoute);
app.use('/', updateRoute);

app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode
    });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
