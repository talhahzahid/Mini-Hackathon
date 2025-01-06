



import express from "express"
import { upload } from "../middleware/multer.middleware.js"
import { createProduct, deleteProduct, getProducts, getSingleProduct, updateProduct } from "../controllers/product.controllers.js"
// import { authenticate } from "../middleware/user.middleware.js"
// import { authenticateUser } from "../middleware/auth.middleware.js"

const router = express.Router()
router.get('/all', getProducts)
router.get('/single/:id', getSingleProduct)
router.post('/product', upload.single("imageUrl"), createProduct)
router.put('/updateproduct/:id', upload.single("imageUrl"), updateProduct)
router.delete('/deleteproduct/:id', deleteProduct)


export default router