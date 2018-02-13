import { taskKeyFields } from '../common';

const createTask = task => `
  mutation {
    createdTask: taskCreate(record: ${task}) {
      record: record {
        ${taskKeyFields}
      }
    }
  }
`;

const updateTaskById = task => `
  mutation {
    updatedTask: taskUpdateById(record: ${task}) {
      record: record {
        ${taskKeyFields}
      }
    }
  }
`;

const deleteTask = id => `
  mutation {
    deletedTask: taskRemoveById(_id: "${id}") {
      record {
        _id
      }
    }
  }
`;

const TaskML = {
  createTask,
  updateTaskById,
  deleteTask
};

export default TaskML;
