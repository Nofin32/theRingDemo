const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/userSchema')

const fs = require('fs')

//const users = []

router.get('/', (req, res) => {
    res.render('register')
  })
  
router.post('/', async (req, res) => {

    let user = new User()

    try {
      //const user = {
        //"id": Date.now().toString(),
        //"name": req.body.name,
        //"email": req.body.email,
        //"password": hashedPassword
      //};
      //users.push({
        //id: Date.now().toString(),
        //name: req.body.name,
        //email: req.body.email,
        //password: hashedPassword
      //})
      const hashedPassword = await bcrypt.hash(req.body.password, 10)

      user.name = req.body.name
      user.email = req.body.email,
      user.password = hashedPassword
      

      const newUser = await user.save()
      console.log('Registered!')

      res.redirect('/login')

    } catch {
      res.render('/register', {
          user: user,
          errorMessage: 'Error creating Author'
      })
    }
  })

  module.exports = {
    router : router
  }