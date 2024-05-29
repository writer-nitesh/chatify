import express from "express"
import cors from "cors"
import dotenv from 'dotenv'
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const PORT = 8000

const genAI = new GoogleGenerativeAI(process.env.API_KEY || "");
app.post("/gemini", async (req, res) => {
    console.log(req.body)
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
    const chat = await model.startChat({
        history: req.body.history
    })

    const result = await chat.sendMessage(req.body.message)
    const response = await result.response
    res.send(response.text())
})


app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

