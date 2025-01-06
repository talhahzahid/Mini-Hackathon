

import users from "../models/user.models.js"
import dotenv from "dotenv"
dotenv.config()
import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import nodemailer from "nodemailer";
import { getSystemErrorMap } from "util";


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'talhazahid218@gmail.com',
        pass: process.env.SMTP_PASS
    }
});



const generateRefreshTokenFromUser = (user) => {
    return jwt.sign({ email: user.email }, process.env.JWT_SECRET_REFRESH, {
        expiresIn: '3m'
    })
}
const generateAccessTokenFromUser = (user) => {
    return jwt.sign({ email: user.email }, process.env.JWT_SECRET_ACCESS, {
        expiresIn: '3m'
    })
}

const uploadImageToCloudinary = async (localpath) => {
    console.log('Uploading image from path:', localpath);
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
        secure: true,
    });

    try {
        const uploadResult = await cloudinary.uploader.upload(localpath, {
            resource_type: "auto",
        });
        fs.unlinkSync(localpath);
        return uploadResult.url;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        if (fs.existsSync(localpath)) {
            fs.unlinkSync(localpath);
        }
        return null;
    }
}


// user signUp form 
const signUp = async (req, res) => {
    const { fullname, email, password } = req.body;
    if (!fullname) return res.status(400).json({ message: "Fullname is required" })
    if (!email) return res.status(400).json({ message: "Email is required" })
    if (!password) return res.status(400).json({ message: "Password is required" })
    if (!req.file) return res.status(400).json({ message: "Image is required" })
    const imageUrl = await uploadImageToCloudinary(req.file.path)
    if (!imageUrl) return res.status(400).json({ message: "Image is required" })
    try {
        const exitUser = await users.findOne({ email });
        if (exitUser) {
            return res.status(400).json({ message: "Email is already registered. Try using another one." });
        }
        const userInfo = await users.create({ fullname, email, password, imageUrl })
        await transporter.sendMail({
            from: '"Maddison Foo Koch 👻" <vernie11@ethereal.email>',
            to: "umarofficial0121@gmail.com",
            subject: "Hello Talha✔",
            text: "Successfully Learn nodemailer",
            html: "<b>Hello world salfgosagoasgvtoa?</b>",
        });
        res.status(201).json({ message: "Register successfully", userInfo })
    } catch (error) {
        console.log("code mein error hein ", error);
    }
}

// User signIn Form
const signIn = async (req, res) => {
    const { email, password } = req.body
    if (!email) return res.status(400).json({ message: 'Email is required' })
    if (!password) return res.status(400).json({ message: 'password is required' })
    try {
        const user = await users.findOne({ email })
        if (!user) return res.status(400).json({ message: "No user found in this email" })
        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) return res.status(400).json({ message: "Incorrect password" })
        const refreshToken = generateRefreshTokenFromUser(user)
        const access = generateAccessTokenFromUser(user)
        res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "None", secure: true })
        res.status(200).json({ message: "Login successfully" })
    } catch (error) {
        console.log("code error", error)
    }
}


// user logOut 

const logOut = async (req, res) => {
    try {
        res.clearCookie('refreshToken');
        res.json({ message: "logout" })
    } catch (error) {
        console.log("error", error);

    }
}

export { signUp, signIn, logOut }   