const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const { composeWithMongoose } = require('graphql-compose-mongoose');

const {updateDateBeforeSave} = require('../graphql/common.js');
const Common = require('../utils/common.js');
const Constants = require('../constants.js');


const TaskSchema = new Schema({
  description: {
    type: String,
    default: "",
    trim: true,
    required: "description is required"
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
      if (!date) return "";

      return Constants.dayNames[date.getDay()]
    }
  }
});

const extendConnection = TaskTC
    .getResolver('connection')
    .addFilterArg({
      name: 'dateRange',
      type: ["String"],
      description: 'Filter tasks by date range',
      query: (query, value, resolveParams) => {
        query = {
          $or: [
            { $and: [{ repeatFrequency: 0 }, { repeatDay: { $lte: value[1], $gte: value[0] } }] },
            { repeatFrequency: 1 },
            { $and: [{ repeatFrequency: 2 }, {  }] },
            { $and: [{ repeatFrequency: 3 }, {  }] },
            { $and: [{ repeatFrequency: 4 }, {  }] },
            { $and: [{ repeatFrequency: 5 }, {  }] }
          ]
        }
      }
    });

const extendCreate = TaskTC.getResolver('createOne')
                            .wrapResolve(updateDateBeforeSave('createdDate'))

const extendUpdate = TaskTC.getResolver('updateById')
                            .wrapResolve(updateDateBeforeSave('updatedDate'))


extendConnection.name = 'connection';
extendCreate.name = 'createOne';
extendUpdate.name = 'updateById';
TaskTC.addResolver(extendConnection);
TaskTC.addResolver(extendCreate);
TaskTC.addResolver(extendUpdate);

module.exports = {
  Task,
  TaskTC
}