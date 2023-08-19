import express from 'express';
import {
    GetAllUserTasks, AddTask, RemoveTask,
    GetAllDailyTasksForUser, AddDailyTask, RemoveDailyTask, MarkTaskAsCompleted, MarkTaskAsNotCompleted
} from '../controllers/userControllers.js'

const taskRouter = express.Router();

taskRouter.get('/tasks/:userId', GetAllUserTasks);
taskRouter.post('/tasks/add/:userId', AddTask); 
taskRouter.delete('/tasks/remove/:userId/:taskId', RemoveTask);

taskRouter.get('/daily/:userId', GetAllDailyTasksForUser); 
taskRouter.post('/daily/add/:userId', AddDailyTask); 
taskRouter.delete('/daily/remove/:userId', RemoveDailyTask); 
taskRouter.put('/daily/mark-completed/:userId', MarkTaskAsCompleted); 
taskRouter.put('/daily/mark-not-completed/:userId', MarkTaskAsNotCompleted); 

export default taskRouter;