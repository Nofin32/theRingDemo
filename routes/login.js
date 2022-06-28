const express = require('express')
const router = express.Router()
const fs = require("fs")

const passport = require('passport')


const initializePassport = require('../config_modules/passport-config')

// read JSON object from file
function jsonReader(filePath, cb) {
  fs.readFile(filePath, (err, fileData) => {
    if (err) {
      return cb && cb(err);
    }
    try {
      const object = JSON.parse(fileData);
      return cb && cb(null, object);
    } catch (err) {
      return cb && cb(err);
    }
  });
}

var users;

users = jsonReader("./jsonfiles/userdb.json", (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  users = data

  function getUserByEmail(email) {
    return users.filter(
      user => user.email === email
    )
  }
  
  function getUserById(id) {
    return users.filter(
      user => user.id === id
    )
  }
  
  initializePassport(
    passport,
    email => getUserByEmail(email)[0],
    id => getUserById(id)[0]
    //id => users.find(user => user.id === id)
  )
});

router.get('/', (req, res) => {
    res.render('login')
  })
  
router.post('/', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }))
  
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

module.exports = router