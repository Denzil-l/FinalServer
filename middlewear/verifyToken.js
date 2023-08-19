import jwt, { decode } from "jsonwebtoken";
import dotenv from 'dotenv'
import { getUserByUserName } from "../models/users.js";
dotenv.config()


export const verifyToken = (req,res,next) => {
    const accessToken = req.body.accessToken

    if(!accessToken) return res.status(401).json({message: 'unauthorized'})

    jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET_KEY, (err,decoded) => {
        if(err){
            console.log(err)
            return res.status(403).json({message: 'verify token failed'})

        } 
        const username = decoded.username

        const checkUserByUserName = async () => {
            try {
                const answer = await getUserByUserName(username)
                
                if(JSON.stringify(answer).length > 0) {
                    console.log('токен прошел успешно')
                    return next()

                }
                return res.status(401).json({message: 'unauthorized'})
            } catch (error) {
                return res.status(401).json({message: 'unauthorized'})
            }
        }

        checkUserByUserName()
    })

}