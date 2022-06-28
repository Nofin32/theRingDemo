if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const fs = require('fs');

const mainRouter = require('./routes/main')
const playerListRouter = require('./routes/player_list')
const bossRouter = require('./routes/boss')
const reportsRouter = require('./routes/reports')
const loginRouter = require('./routes/login')
const registerRouter = require('./routes/register')
const initializePassport = require('./config_modules/passport-config')



app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout_1')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))
app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())


const mongoose = require('mongoose')
mongoose.connect(process.env.db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', ()=>console.log('Connected to Mongoose'))

app.use('/login', checkNotAuthenticated, loginRouter)
app.use('/register', checkNotAuthenticated, registerRouter.router)
app.use('/', checkAuthenticated, mainRouter)
app.use('/player_list', checkAuthenticated, playerListRouter)
app.use('/boss', checkAuthenticated, bossRouter)
app.use('/reports', checkAuthenticated, reportsRouter)

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }
  
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }

app.listen(process.env.PORT || 3000)