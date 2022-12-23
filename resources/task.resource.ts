import {ITask, ITaskModel} from "../models/task.model";

const taskResource = (task: ITaskModel): ITask => {
    return {
        completed: task.completed,
        name: task.name,
        id: task._id
    }
}

module.exports = taskResource