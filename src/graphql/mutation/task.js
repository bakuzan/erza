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


const TaskML = {
  createTask,
  updateTaskById
}

export default TaskML
