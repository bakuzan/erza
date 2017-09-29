import React, {Component} from 'react';
import Elm from 'react-elm-components'


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

    // this.ports.tasks.send()
  }

  handleUpdate(task) {

    // this.ports.task.send()
  }

  handleDelete(taskId) {

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
