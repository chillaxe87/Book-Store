const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Book = require('../models/book')


// Create New Book  
router.post('/book/new', async (req, res) => {
    const book = new Book(req.body)
    try {
        await book.save()
        res.status(201).send(book)
    } catch (err) {
        res.status(400).send(err)
    }
})

// Add book to users cart by books ID and users authentication
router.post('/book/add/:id', auth, async (req, res) => {
    const book = await Book.findById(req.params.id)
    book.owner.push(req.user._id)
    try {
        await book.save()
        res.status(201).send(book)
    } catch {
        res.status(400).send(err)
    }
})

// Remove book from cart of a user
router.post('/user/cart/:id', auth, async (req, res) => {
    const book = await Book.findById(req.params.id)
    try {
        book.owner = book.owner.filter(owner => owner != req.user._id.toString())
        await book.save()
        res.send(book)
    } catch (err) {
        res.status(500).send(err)
    }
})

// Get all books for page rendering - no auth
router.get('/book/all', async (req, res) => {
    try {
        const books = await Book.find({}, null, { limit: 10}).exec()
        res.send(books)
    } catch (err) {
        res.status(500).send()
    }
})

// Get one book for add to cart page - no auth
router.get('/book/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
        if (!book) {
            return res.status(404).send()
        }
        res.send(book)
    } catch (err) {
        res.status(500).send(err)
    }
})

// Update books info - no auth
router.patch('/book/:name', async (req, res) => {
    const booksAll = await Book.find({})
    const books = booksAll.filter(book => book.name == req.params.name)

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'price', 'description', 'pages', 'avatar']

    const isValidUpdate = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!isValidUpdate) {
        return res.status(400).send({
            error: "Invalid Updates"
        })
    }
    try {
        for (i = 0; i < books.length; i++) {
            updates.forEach((update) => {
                books[i][update] = req.body[update]
            })
            await books[i].save()
        }
        res.send(books)
    } catch (err) {
        res.status(500).send(err)
    }
})

// Delete book from the data 
router.delete('/book/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id)
        res.send({
            book,
            deleted: true
        })
    } catch (err) {
        res.status(500).send(err)
    }
})

module.exports = router