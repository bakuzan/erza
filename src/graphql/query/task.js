import { constructFilterString, taskKeyFields } from '../common'


const getTasksForDateRange = filters => (`
  {
    taskConnection(${constructFilterString(filters)}) {
      ${taskKeyFields}
    }
  }
`)


const TaskQL = {
  getTasksForDateRange
}

export default TaskQL
