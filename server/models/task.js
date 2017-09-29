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
  repeatFrquency: {
    type: Number,
    default: 0
  },
  repeatDay: {
    type: Date
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


const extendCreate = TaskTC.getResolver('createOne')
                            .wrapResolve(updateDateBeforeSave('createdDate'))

const extendUpdate = TaskTC.getResolver('updateById')
                            .wrapResolve(updateDateBeforeSave('updatedDate'))


extendCreate.name = 'createOne';
extendUpdate.name = 'updateById';

TaskTC.addResolver(extendCreate);
TaskTC.addResolver(extendUpdate);

module.exports = {
  Task,
  TaskTC
}
