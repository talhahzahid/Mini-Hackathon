

import express from "express"
import { upload } from "../middleware/multer.middleware.js"
import { logOut, signIn, signUp } from "../controllers/user.controllers.js"

    
const router = express.Router()

router.post("/signup", upload.single("imageUrl"), signUp)
router.post('/signin', signIn)
router.get('/logout', logOut)
export default router