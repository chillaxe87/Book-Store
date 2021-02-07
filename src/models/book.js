const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        price: {
            type: Number,
            require: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        pages: {
            type: Number,
            required: true,
            trim: true
        },
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        avatar: {
            type: Buffer
        }
    }, {
        timestamps: true
    }
)

const Book = mongoose.model('Book', bookSchema)

module.exports = Book