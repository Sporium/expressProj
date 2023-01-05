import {ITask, ITaskDocument} from "../models/task.model";

const taskResource = (task: ITaskDocument): ITask => {
    return {
        completed: task.completed,
        name: task.name,
        id: task._id
    }
}

module.exports = taskResource