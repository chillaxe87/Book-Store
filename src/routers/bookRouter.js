const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Book = require('../models/book')

router.post('/book/new', async (req, res) => {
    const book = new Book(req.body)
    try {
        await book.save()
        res.status(201).send(book)
    } catch (err) {
        res.status(400).send(err)
    }
})

module.exports = router