

import express from "express"
import { getOrders, placeOrder } from "../controllers/order.controllers.js"

const router = express.Router()

router.post('/order', placeOrder)
router.post('/checkorder', getOrders)

export default router