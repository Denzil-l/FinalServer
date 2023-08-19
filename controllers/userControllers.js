import { getUserByUserName, createUser, getAllTasks, createTask, deleteTask, createDailyTask, deleteDailyTask, getAllDailyTasksForUser, markTaskCompleted, markTaskNotCompleted   } from "../models/users.js";

import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import jwt from "jsonwebtoken";
dotenv.config()

//USERS
export const Register = async (req,res) =>{
    const {username, password, email} = req.body
    console.log('Я получил запрос')
    try {
        const userExist = await getUserByUserName(username)
        if(!userExist){
            try {
                console.log('user exist')
                const saltRounds = 10;
                const salt = await bcrypt.genSalt(saltRounds);
            
                const hashedPassword = await bcrypt.hash(password, salt); 

                try {
                    const newUser = await createUser({username: username, password: hashedPassword, email: email})
                    console.log(`New user is ${newUser}`)
                    res.status(200).json({message: 'New user was created successfylly'})
                } catch (error) {
                    console.log(error)
                    res.status(500).json({message: 'Something was wrong'})    
                }
            } catch (error) {
                console.log(error)
                res.status(500).json({message: 'Something was wrong'})    
            }
        }else{
            res.status(400).json({message: 'This user is already exist'})   

        }

    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something was wrong'})     
    }
}

export const Login = async (req,res) =>{
    const {username, password} = req.body
    try {
        const userExist = await getUserByUserName(username)
        if(userExist !== undefined){
            try {
                
                const match = await bcrypt.compare(password, userExist.password)

                if(match){

                    const userId = userExist.id 
                    const username = userExist.username
                    const accessToken = jwt.sign({ userId, username }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '10m' });

                    

                    res.status(200).json({token:userId, accessToken: accessToken})

                }else{
                    res.status(400).json({message: 'Password is not correct'})
                }

            } catch (error) {
                console.log(error)
                res.status(500).json({message: 'Something was wrong'})

            }
        }else{
            res.status(400).json({message: 'This user is not exist'})

        }
    } catch (error) {
        res.status(500).json({message: 'Something was wrong 2'})

    }
}

export const Logout = (req, res) => {
    res.clearCookie("token");
    return res.sendStatus(200);
  };



//TASKS
export const GetAllUserTasks = async (req, res) => {
    console.log('I am here')
    const userId = req.params.userId
    console.log(userId)
    try {
        const tasks = await getAllTasks(userId); 
        res.status(200).json(tasks);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};
  
export const AddTask = async (req, res) => {
    const userId = req.params.userId; 
    const { name, text, type } = req.body;
    console.log(name)
    console.log(type)
    console.log(text)
    try {
    
        await createTask({ user_id: userId, name: name, text: text, type: type }); 
        const tasks = await getAllTasks(userId); 
        res.status(201).json({ tasks, message: 'Task added successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const RemoveTask = async (req, res) => {
    const taskId = req.params.taskId; 
    const userId = req.params.userId; 
    console.log(taskId)
    try {
        await deleteTask(taskId); 
        const tasks = await getAllTasks(userId);
        res.status(200).json({ tasks, message: 'Task deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

//DAILY_TASKS

export const GetAllDailyTasksForUser = async (req,res) => {
    const userId = req.params.userId
    console.log(userId)
    try {
        const tasks = await getAllDailyTasksForUser(userId); 
        res.status(200).json(tasks);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const AddDailyTask = async (req, res) => {
    const userId = req.params.userId; 
    const { name } = req.body; 
    const completed_days = []
    console.log('hi')
    try {
        await createDailyTask({ user_id:userId, name, completed_days }); 
        const tasks = await getAllDailyTasksForUser(userId); 
        res.status(201).json({ tasks: tasks});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const RemoveDailyTask = async (req, res) => {
    const userId = req.params.userId

    console.log(req.body)
    const name = req.body.name; 
    console.log(name)
    try {
        await deleteDailyTask(name); 
        const tasks = await getAllDailyTasksForUser(userId); 
        res.status(200).json({ tasks: tasks});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const MarkTaskAsCompleted = async (req, res) => {
    const userId = req.params.userId; 
    const { name, day } = req.body.data;
    console.log(userId)
    console.log(name)
    console.log(day)
    try {

        await markTaskCompleted({ userId, name, day }); 
        const tasks = await getAllDailyTasksForUser(userId); 
        res.status(200).json({tasks});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const MarkTaskAsNotCompleted = async (req, res) => {
    const userId = req.params.userId;
    const { name, day } = req.body.data; 
    console.log('I am here now')
    try {
        await markTaskNotCompleted({ userId, name, day });
        const tasks = await getAllDailyTasksForUser(userId); 
        res.status(200).json({ tasks: tasks});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};