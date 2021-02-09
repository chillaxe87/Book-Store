const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Book = require('./book')

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
            validate(value) {
                if(!validator.isEmail(value)){
                    throw new Error('Email is Invalid')
                }
            }
        },
        password: {
            type: String,
            trim: true,
            require: true,
            validator(value) {
                if(value.length < 7) {
                    throw new Error('Password must be at least 8 characters long')
                }
            }
        },
        tokens: [{
            token: {
                type: String,
                required: true
            }
        }]
    }, {
        timestamps: true
    }
)
userSchema.virtual('books', {
    ref: 'Book',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

JWT_Secret = process.env.JWT_SECRET
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, JWT_Secret)

    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne( {email} )
    if (!user) {
        throw new Error ('Email or password is incorrect')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error ('Email or password is incorrect')
    }

    return user
}

userSchema.pre('save', async function(next){
    const user = this

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
})

userSchema.pre('remove', async function (next) {
    const user = this
    await Book.deleteMany({owner: user._id})
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User