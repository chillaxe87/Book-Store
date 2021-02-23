const jwt = require('jsonwebtoken')
const Admin = require('../models/admin')

const auth = async (req, res, next) => {
    try{
        const token = req.header('authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN)
        const admin = await Admin.findOne({ _id: decoded._id.toString(), 'tokens.token': token })
        if(!admin){
            throw new Error()
        }
        req.token = token
        req.admin = admin
        next()
    } catch(err) {
        res.status(401).send({ error: "Please authenticate"})
    }
}
module.exports = auth