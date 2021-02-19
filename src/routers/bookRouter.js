const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Book = require('../models/book')
const multer = require('multer')
const sharp = require('sharp')


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
router.post('/book/add', auth, async (req, res) => {
    const book = await Book.findById(req.query._id)
    book.owner.push(req.user._id)
    try {
        await book.save()
        res.status(201).send(book)
    } catch {
        res.status(400).send(err)
    }
})

// Remove book from cart of a user
router.post('/user/cart', auth, async (req, res) => {
    const book = await Book.findById(req.query._id)
    try {
        let removed = false
        book.owner = book.owner.filter(owner => {
            if (owner == req.user._id.toString() && !removed) {
                removed = true
                return false
            }
            return true
        })
        await book.save()
        res.send({ book, removed: true })
    } catch (err) {
        res.status(500).send(err)
    }
})
// Remove all books from cart
router.post('/user/cart/all', auth, async (req, res) => {
    const books = await Book.find({})
    try {
        for (i = 0; i < books.length; i++) {
            books[i].owner = books[i].owner.filter(owner => {
                return owner != req.user._id.toString()
            })
            await books[i].save()
        }

        res.send("Purchase successful")
    } catch (err) {
        res.status(500).send(err)
    }
})

// Get all books for page rendering - no auth
router.get('/book/all', async (req, res) => {
    const page = parseInt(req.query.page)
    try {
        const books = await Book.find({}, null, { limit: 10, skip: page }).exec()
        res.send(books)
    } catch (err) {
        res.status(500).send()
    }
})

// Get one book by id 
router.get('/book/get', async (req, res) => {
    try {
        const book = await Book.findById(req.query._id)
        if (!book) {
            return res.status(404).send()
        }
        res.send(book)
    } catch (err) {
        res.status(500).send(err)
    }
})

// Get books by name 

router.get('/book/find', async (req, res) => {
    const search = req.query.text.toString()
    try {
        const books =  await Book.find({ name: { "$regex": search, "$options": "i" } });
        if (!books) {
            return res.status(404).send({ message: "no books found" })
        }
        res.send(books)
    } catch (err) {
        res.status(500).send(err)
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
        const book = await Book.deleteOne({ _id: req.params.id })
        res.send({
            book,
            deleted: true
        })
    } catch (err) {
        res.status(500).send(err)
    }
})


module.exports = router