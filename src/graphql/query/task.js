import { constructFilterString, taskKeyFields } from '../common'


const getTasksForDateRange = filters => (`
  {
    tasks: taskConnection(${constructFilterString(filters)}) {
      edges {
        node {
          ${taskKeyFields}
        }
      }
    }
  }
`)


const TaskQL = {
  getTasksForDateRange
}

export default TaskQL
