import { constructFilterString, taskKeyFields } from '../common'


const getTasksForDateRange = filters => (`
  {
    tasks: taskMany(${constructFilterString(filters)}) {
      ${taskKeyFields}
    }
  }
`)


const TaskQL = {
  getTasksForDateRange
}

export default TaskQL
