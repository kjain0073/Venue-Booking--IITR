import path from 'path'
import express  from 'express'
import dotenv from 'dotenv'
import bodypParser from 'body-parser'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import router from './routes/channeli/index.js'
import acadsRouter from './routes/acads/index.js' 
import bookingRouter from './routes/bookings/index.js'

import signUpRouter from './routes/auth/signUp/index.js'
import signInrouter from './routes/auth/signIn/index.js'
import signOutRouter from './routes/auth/signOut/index.js'

import ExpressValidator from 'express-validator'
import lhcRouter from './routes/LHC/index.js'

const __dirname = path.resolve() // why __dirname is not working 
dotenv.config({path:path.resolve(__dirname , '.env')}) 
const port  = process.env.PORT || 5000


const app = express()

//third party middlwares 
app.use(bodypParser.json())
app.use(cookieParser())

app.use(morgan('dev'))

//to allow Cross origin requests!
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST")
    next()
    })

app.use(router)
app.use(acadsRouter)
app.use(bookingRouter)
app.use(lhcRouter)
app.use(ExpressValidator())  //validations of input by user , for example email validations and non-empty password validationss
app.use(signUpRouter)
app.use(signInrouter)
app.use(signOutRouter)

app.listen(port, ()=> console.log("listening at Port " + port))