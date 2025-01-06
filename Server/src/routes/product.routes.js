



import express from "express"
import { upload } from "../middleware/multer.middleware.js"
import { createProduct, deleteProduct, getProducts, getSingleProduct, updateProduct } from "../controllers/product.controllers.js"
import { authenticate } from "../middleware/user.middleware.js"


const router = express.Router()

router.post('/product', authenticate, upload.single("imageUrl"), createProduct)
router.put('/updateproduct/:id', authenticate, upload.single("imageUrl"), updateProduct)
router.delete('/deleteproduct/:id', authenticate, deleteProduct)
router.get('/single/:id', authenticate, getSingleProduct)
router.get('/all', getProducts)


export default router