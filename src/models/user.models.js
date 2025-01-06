

import mongoose from "mongoose";
import bcrypt from "bcrypt"
const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'customer'],
        default: 'customer',
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
    }],
    imageUrl: {
        type: String,
        required: true
    },
}, { timestamps: true })

userSchema.pre('save', async function (next) {
    const user = this
    if (!user.isModified("password")) return
    const hashedPassword = await bcrypt.hash(user.password, 13)
    user.password = hashedPassword
    next()
})

export default mongoose.model('users', userSchema)