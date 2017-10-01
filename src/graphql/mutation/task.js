import { taskKeyFields } from "../common"


const createTask = task => (`
  mutation {
    taskCreate(record: ${task}) {
      record: record {
        ${taskKeyFields}
      }
    }
  }
`)

const updateTaskById = task => (`
  mutation {
    taskUpdateById(record: ${task}) {
      record: record {
        ${taskKeyFields}
      }
    }
  }
`)

const deleteTask = id => (`
  mutation {
    taskRemoveById(_id: "${id}") {
      record {
        _id
      }
    }
  }
`)


const TaskML = {
  createTask,
  updateTaskById,
  deleteTask
}

export default TaskML
