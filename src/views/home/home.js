import React, {Component} from 'react';
import Elm from 'react-elm-components'

import {Strings} from '../../constants/values'
import {weekBeginning, weekEnding} from '../../utils/date'

import {Main} from '../../yoruichi/build/static/js/yoruichi'
import '../../yoruichi/build/static/css/yoruichi.css'


class Home extends Component {

  constructor(props) {
    super(props);

    this.setupPorts = this.setupPorts.bind(this);
    this.handleFetch = this.handleFetch.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  shouldComponentUpdate() {
    return false
  }

  setupPorts(ports) {
    this.ports = ports;
    this.ports.fetch.subscribe(this.handleFetch)
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

    // query server

    // this.ports.tasks.send()
  }

  handleUpdate(task) {
    // send task to server
    // this.ports.task.send()
  }

  handleDelete(taskId) {
    // send id to server
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
