

import users from "../models/user.models.js"
import products from "../models/product.models.js"
import dotenv from "dotenv"
dotenv.config()
import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

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



// list new product 
const createProduct = async (req, res) => {
    const { name, description, price } = req.body;
    if (!name) return res.status(400).json({ message: "name is required" })
    if (!description) return res.status(400).json({ message: "name is required" })
    if (!price) return res.status(400).json({ message: "name is required" })
    if (!req.file) return res.status(400).json({ message: "image is required" })
    const imageUrl = await uploadImageToCloudinary(req.file.path)
    if (!imageUrl) return res.status(400).json({ message: "Image is required" })
    try {
        const userInfo = await products.create({ name, description, price, imageUrl })
        res.status(201).json({ message: "pruduct list ", userInfo })
    } catch (error) {
        console.log('code mein error', error);
    }
}

// get single product 
const getSingleProduct = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "id is required" });
    }
    try {
        const product = await products.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Success", product });
    } catch (error) {
        console.log("Code error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// GET /products 
const getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;
        const product = await products.find({})
            .skip(skip)
            .limit(limit);
        const totalProducts = await products.countDocuments({});

        res.status(200).json({
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit),
            totalProducts,
            product,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


//update product 
const updateProduct = async (req, res) => {
    const { id } = req.params
    const { name, description, price } = req.body
    if (!name) return res.status(400).json({ message: "name is required" })
    if (!description) return res.status(400).json({ message: "name is required" })
    if (!price) return res.status(400).json({ message: "name is required" })
    if (!req.file) return res.status(400).json({ message: "image is required" })
    const imageUrl = await uploadImageToCloudinary(req.file.path)
    if (!imageUrl) return res.status(400).json({ message: "Image is required" })
    try {
        const updateProduct = await products.findByIdAndUpdate(id, {
            name, description, price, imageUrl
        })
        res.status(201).json({ message: "update Succesfully", updateProduct })
    } catch (error) {
        console.log("code error", error);
    }
}

// delte product 
const deleteProduct = async (req, res) => {
    const { id } = req.params
    if (!id) return res.status(400).json({ message: "id is required" })
    try {
        const userInfo = await products.findByIdAndDelete(id)
        return res.status(200).json({ userInfo })
    } catch (error) {
        console.log('code error ', error);
    }
}

export { createProduct, getSingleProduct, getProducts, updateProduct, deleteProduct }