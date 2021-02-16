const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')
const Book = require('../models/book')


// Sign up new user 
router.post('/users/new', async (req, res) => {
    const user = new User(req.body)
    try {
        const token = await user.generateAuthToken()
        await user.save()
        res.status(201).send({ user, token })
    } catch (err) {
        res.status(400).send(err)
    }
})

// login user
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (err) {
        res.status(400).send({
            message: "unable to log in"
        })
    }
})

// logout user
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
        await req.user.save()
        res.send()
    } catch (err) {
        res.status(500).send()
    }
})

// Get the books in cart for user
router.get('/users/cart', auth, async (req, res) => {
    try {
        await req.user.populate('books').execPopulate()
        res.send(req.user.books)
    } catch (err) {
        res.status(500).send()
    }
})

// get user 
router.get('/users/me', auth, async (req, res) => {
    if (req.user) {
        res.send(req.user)
    }
})

// update user info 

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['username', 'password']

    const isValidUpdate = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!isValidUpdate) {
        return res.status(400).send({
            error: "Invalid Updates"
        })
    }

    try {
        updates.forEach(update => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (err) {
        res.status(500).send(err)
    }

})
// delete user 
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (err) {
        res.status(500).send(err)
    }
})

module.exports = router