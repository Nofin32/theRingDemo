const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('playerlist/player_list')
})

module.exports = router