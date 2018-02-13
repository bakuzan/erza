const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const { composeWithMongoose } = require('graphql-compose-mongoose');

const { updateDateBeforeSave } = require('../graphql/common.js');
const Common = require('../utils/common.js');
const Constants = require('../constants.js');

const TaskSchema = new Schema({
  description: {
    type: String,
    default: '',
    trim: true,
    required: 'description is required'
  },
  isComplete: {
    type: Boolean,
    default: false
  },
  repeatFrequency: {
    type: Number,
    default: 0
  },
  repeatDay: {
    type: Date
  },
  completedOccurances: {
    type: [String],
    default: []
  },
  updatedDate: {
    type: Date,
    default: Date.now,
    unique: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
});

const Task = mongoose.model('Task', TaskSchema);
const TaskTC = composeWithMongoose(Task);

TaskTC.addFields({
  dayOfWeek: {
    type: 'String',
    description: 'Day of the week for repeatDay',
    resolve: (source, args, context, info) => {
      const date = source.repeatDay;
      if (!date) return '';

      return Constants.dayNames[date.getDay()];
    }
  }
});

const forceISODate = d => new Date(new Date(d).toISOString());
const extendFindMany = TaskTC.getResolver('findMany').addFilterArg({
  name: 'dateRange',
  type: ['String'],
  description: 'Filter tasks by date range',
  query: (query, value, resolveParams) => {
    const start = forceISODate(value[0]);
    const end = forceISODate(value[1]);

    query = {
      $or: [
        {
          $and: [
            { repeatFrequency: 0 },
            { repeatDay: { $lte: end, $gte: start } }
          ]
        },
        {
          $and: [{ repeatFrequency: { $ne: 0 } }, { repeatDay: { $lte: end } }]
        }
      ]
    };
  }
});

const extendCreate = TaskTC.getResolver('createOne').wrapResolve(
  updateDateBeforeSave('createdDate')
);

const extendUpdate = TaskTC.getResolver('updateById').wrapResolve(
  updateDateBeforeSave('updatedDate')
);

extendFindMany.name = 'findMany';
extendCreate.name = 'createOne';
extendUpdate.name = 'updateById';
TaskTC.addResolver(extendFindMany);
TaskTC.addResolver(extendCreate);
TaskTC.addResolver(extendUpdate);

module.exports = {
  Task,
  TaskTC
};
