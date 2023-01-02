import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import cors from "cors"
import postRouter from "./routers/posts.js"
import userRouter from "./routers/users.js"
import * as dotenv from "dotenv"
dotenv.config()
const app = express()

app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use(cors())

app.use("/posts", postRouter)
app.use("/users", userRouter)
app.get("/", (req, res) => {
  res.send("Hello to memories api")
})
const PORT = process.env.PORT

mongoose.set("strictQuery", false)

mongoose
  .connect(process.env.CONNECTION_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connecting to DB successfully")

    app.listen(PORT, () => {
      console.log("server listening on " + PORT)
    })
  })
  .catch((err) => console.log("Error connecting to DB", err))
