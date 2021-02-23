const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique:true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Email is Invalid')
                }
            }
        },
        password: {
            type: String,
            trim: true,
            required: true,
            validate(value) {
                if (value.length < 7) {
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

adminSchema.methods.toJSON = function () {
    const admin = this
    const adminObject = admin.toObject()

    delete adminObject.password
    delete adminObject.tokens

    return adminObject
}


adminSchema.methods.generateAuthToken = async function () {
    const admin = this
    const token = jwt.sign({ _id: admin._id.toString() }, process.env.JWT_SECRET_ADMIN)

    admin.tokens = admin.tokens.concat({ token })
    await admin.save()

    return token
}

adminSchema.statics.findByCredentials = async (email, password) => {
    const admin = await Admin.findOne({ email })
    if (!admin) {
        throw new Error('Email or password is incorrect')
    }

    const isMatch = await bcrypt.compare(password, admin.password)

    if (!isMatch) {
        throw new Error('Email or password is incorrect')
    }

    return admin
}

adminSchema.pre('save', async function (next) {
    const admin = this

    if (admin.isModified('password')) {
        admin.password = await bcrypt.hash(admin.password, 8)
    }
})

const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin