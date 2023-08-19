import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import userRouter from './routes/users.js'
import taskRouter from './routes/tasks.js'
dotenv.config()

const app = express()

app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser())

app.get('/', (req,res)=>{
    res.send('Test')
})

app.listen(process.env.PORT, () => console.log(`Server is running in port ${process.env.PORT}`))

app.use('/auth', userRouter)
app.use('/content', taskRouter)

