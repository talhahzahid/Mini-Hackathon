import express, { urlencoded } from "express"
import dotenv from "dotenv"
dotenv.config()
const app = express()
const port = process.env.port
import userRouter from "./src/routes/user.routes.js"
import productRoutes from "./src/routes/product.routes.js"
import orderRoutes from "./src/routes/order.routes.js"
import connectdb from "./src/db/index.js"
import cookieParser from "cookie-parser"

app.use(urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
app.use('/user', userRouter)
app.use('/api/v1', productRoutes)
app.use('/api/v2' , orderRoutes)
app.get('/', (req, res) => {
    req.send("Hello Hackathon")
})

connectdb()
    .then((res) => {
        app.listen(port, () => {
            console.log("server is rinning at port ", port);
        })
    })
    .catch((err) => {
        console.log(err);
    })