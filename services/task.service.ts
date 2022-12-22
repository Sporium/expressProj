import {ITask, ITaskModel} from "../models/task.model";

const taskService = (task: ITaskModel): ITask => {
    return {
        completed: task.completed,
        name: task.name
    }
}

module.exports = taskService