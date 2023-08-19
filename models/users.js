import db from '../config/db.js'

export const getUserByUserName = async (username) => {
    const answer = await db('profiles').where({username}).first()
    console.log(`User is: ${JSON.stringify(answer)}`)
    return answer

}

export const createUser = async (user) => {
    const answer = db('profiles').insert(user)
    console.log(`I am in models and answer is ${answer}`)
    return answer
}





// Функции для таблицы tasks

export const getAllTasks = async (userId) => {
    console.log(userId)
    console.log('It')
    const tasks = await db('tasks').where('user_id', userId).select();
    console.log(tasks)
    return tasks;
};

export const createTask = async (task) => {
    const taskId = await db('tasks').insert(task);
    return taskId;
};

export const deleteTask = async (taskId) => {
    const deletedRows = await db('tasks').where({ id: taskId }).del();
    return deletedRows;
};

// Функции для таблицы daily_tasks

export const getAllDailyTasksForUser = async (userId) => {
    const dailyTasks = await db('daily_tasks').where({ user_id: userId }).select();
    return dailyTasks;
};

export const createDailyTask = async (dailyTask) => {
    const dailyTaskId = await db('daily_tasks').insert(dailyTask);
    return dailyTaskId;
};

export const deleteDailyTask = async (name) => {
    const deletedRows = await db('daily_tasks').where({ name: name }).del();
    return deletedRows;
};


export const markTaskCompleted = async ({ userId, name, day }) => {
    try {
        console.log(userId)
        console.log(name)
        console.log(day)
        const task = await db('daily_tasks').where({ user_id: userId, name }).first();
        if (!task) {
            throw new Error('Task not found');
        }

        const completedDays = task.completed_days || [];
        if (!completedDays.includes(day)) {
            completedDays.push(day);
        }

        await db('daily_tasks').where({ user_id: userId, name }).update({ completed_days: completedDays });
    } catch (error) {
        throw error;
    }
};

export const markTaskNotCompleted = async ({ userId, name, day }) => {
    try {
        const task = await db('daily_tasks').where({ user_id: userId, name }).first();
        if (!task) {
            throw new Error('Task not found');
        }

        const completedDays = task.completed_days || [];
        const index = completedDays.indexOf(day);
        if (index !== -1) {
            completedDays.splice(index, 1);
        }

        await db('daily_tasks').where({ user_id: userId, name }).update({ completed_days: completedDays });
    } catch (error) {
        throw error;
    }
};