const express = require('express')
const router = new express.Router()
const auth = require('../middleware/admin-auth')
const Admin = require('../models/admin')

// Sign up new admin 
router.post('/admin/new', async (req, res) => {
    const admin = new Admin(req.body)
    try {
        const token = await admin.generateAuthToken()
        await admin.save()
        res.status(201).send({ admin, token })
    } catch (err) {
        res.status(400).send(err)
    }
})
router.get('/admin/me', auth, async (req, res) => {
    if (req.admin) {
        res.send(req.admin)
    }
})

router.post('/admin/login', async (req, res) => {
    try {
        const admin = await Admin.findByCredentials(req.body.email, req.body.password)
        const token = await admin.generateAuthToken()
        res.send({ admin, token })
    } catch (err) {
        res.status(400).send({
            message: "unable to log in"
        })
    }
})

// logout admin
router.post('/admin/logout', auth, async (req, res) => {
    try {
        req.admin.tokens = req.admin.tokens.filter((token) => token.token !== req.token)
        await req.admin.save()
        res.send()
    } catch (err) {
        res.status(500).send()
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.admin.remove()
        res.send(req.admin)
    } catch (err) {
        res.status(500).send(err)
    }
})

module.exports = router