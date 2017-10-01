import React, {Component} from 'react';
import Elm from 'react-elm-components'

import {fetchFromServer} from '../../graphql/fetch'
import {constructRecordForPost} from '../../graphql/common'
import TaskQL from '../../graphql/query/task'
import TaskML from '../../graphql/mutation/task'
import {Paths} from '../../constants/paths'
import {Strings} from '../../constants/values'
import {weekBeginning, weekEnding} from '../../utils/date'

import {Main} from '../../yoruichi/build/static/js/yoruichi'
import '../../yoruichi/build/static/css/yoruichi.css'


const query = method => str => fetchFromServer(`${Paths.graphql.base}${str}`, method)
const getTasks = query('GET')
const mutateTasks = query('POST')

class Home extends Component {

  constructor(props) {
    super(props);

    this.setupPorts = this.setupPorts.bind(this);
    this.handleFetch = this.handleFetch.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  shouldComponentUpdate() {
    return false
  }

  setupPorts(ports) {
    this.ports = ports;
    this.ports.fetch.subscribe(this.handleFetch)
    this.ports.create.subscribe(this.handleCreate)
    this.ports.update.subscribe(this.handleUpdate)
    this.ports.delete.subscribe(this.handleDelete)
  }

  handleFetch({ timePeriod, targetDate }) {
    let range;
    if (timePeriod === Strings.timePeriod.day) {
      range = [formatDateForInput(targetDate), formatDateForInput(targetDate)];
    } else if (timePeriod === Strings.timePeriod.week) {
       range = [formatDateForInput(weekBeginning(targetDate)), formatDateForInput(weekEnding(targetDate))];
    }

    // const query = {
    //   filter: {
    //
    //   }
    // }
    // getTasks(TaskQL.getTaskForDateRange(query))
    // .then(result => {
    //
    //   // this.ports.tasks.send()
    // })
  }

  handleCreate(task) {
    delete task.id;

    const newTask = constructRecordForPost(task)
    mutateTasks(TaskML.createTask(newTask))
    .then(result => this.ports.task.send(result.data.record))
  }

  handleUpdate(task) {
    const updatedTask = constructRecordForPost(task)

    mutateTasks(TaskML.updateTaskById(updatedTask))
    .then(result => this.ports.task.send(result.data.record))
  }

  handleDelete(taskId) {
    mutateTasks(TaskML.deleteTask(taskId))
  }

  render() {
    return (
      <div id="yoruichi" className="flex-column">
        <Elm src={Main} ports={this.setupPorts} />
      </div>
    )
  }

}

export default Home;
