import { constructFilterString, taskKeyFields } from '../common'


const getTaskForDateRange = filters => (`
  {
    taskConnection(${constructFilterString(filters)}) {
      ${taskKeyFields}
    }
  }
`)


const TaskQL = {
  getTaskForDateRange
}

export default TaskQL
