

import express from "express"
import { upload } from "../middleware/multer.middleware.js"
import { signIn, signUp } from "../controllers/user.controllers.js"

    
const router = express.Router()

router.post("/signup", upload.single("imageUrl"), signUp)
router.post('/signin', signIn)
export default router