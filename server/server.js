require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const { logger } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
//const corsOptions = require('./config/corsOptions')
const { default: mongoose } = require('mongoose')
const AddRecipient = require('./routes/recipientadd')
const TransactionRouter = require('./routes/NewT')
const DataRouter = require('./routes/Transaction')
const UserRouter = require('./routes/userRoutes')
const AuthRouter = require('./routes/AuthRoutes')
const CsvRouter = require('./routes/CsvTransaction')

//app routes
app.use(logger)
app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, 'public')))
app.use('/', require('./routes/root'))

app.use(errorHandler)

//routes
app.use('/auth',AuthRouter)
app.use('/api',TransactionRouter)
app.use('/api',AddRecipient)
app.use('/api',DataRouter)
app.use('/users',UserRouter)
app.use('/api',CsvRouter)


//db connection
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    app.listen(process.env.PORT, () => {
        //console.log('Connected to MongoDB')
        //console.log('Server listening to port', process.env.PORT)
    })
})
.catch((err) => {
    console.error('Error connecting to database:', err.message)
    process.exit(1)
})

