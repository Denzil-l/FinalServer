import express from 'express'
import { Login, Register, Logout } from '../controllers/userControllers.js'
import { verifyToken } from '../middlewear/verifyToken.js'

const userRouter = express.Router()


userRouter.post('/register', Register)
userRouter.post('/login', Login)
userRouter.delete('/logout', Logout)
userRouter.post('/verify', verifyToken, (req,res) =>{
    res.status(200).json({status:200})
})
export default userRouter