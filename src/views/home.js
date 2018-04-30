import React, { Component } from 'react';

import ElmWrapper from '../components/elm-wrapper';
import fetchFromServer from '../graphql/fetch';
import { constructRecordForPost } from '../graphql/common';
import TaskQL from '../graphql/query/task';
import TaskML from '../graphql/mutation/task';
import { Paths } from '../constants/paths';
import { Strings, Days } from '../constants/values';
import {
  formatDateForInput,
  dateStringToISOString,
  weekBeginning,
  weekEnding,
  daysDifferentBetweenDates
} from '../utils/date';

import { Main } from 'yoruichi/js/yoruichi';
import 'yoruichi/css/yoruichi.css';
// import '../components/radio-button/radio-button.css';
import '../components/list-components/item-list/item-list.css';

const query = method => str =>
  fetchFromServer(`${Paths.graphql.base}${str}`, method);
const getTasks = query('GET');
const mutateTasks = query('POST');

const fixRepeatDay = t => ({
  ...t,
  repeatDay: dateStringToISOString(t.repeatDay)
});

const temporaryClientSideFilter = ([start, end]) => {
  const startDoW = new Date(start).getDay();
  const endDoW = new Date(end).getDay();
  const isSingleDay = startDoW === endDoW;

  return ({ repeatFrequency, repeatDay }) => {
    const repeatDate = new Date(repeatDay);
    const repeatDayStr = repeatDay.split('T')[0];
    const repeatDoW = repeatDate.getDay();
    const startDiff = daysDifferentBetweenDates(repeatDate, start);
    const endDiff = daysDifferentBetweenDates(repeatDate, end);

    return (
      repeatDayStr <= end &&
      ((repeatDayStr >= start && repeatDayStr <= end) ||
        repeatFrequency === 1 ||
        (repeatFrequency === 2 &&
          ((isSingleDay && repeatDoW === startDoW) || !isSingleDay)) ||
        (repeatFrequency === 3 && 28 >= startDiff && 28 <= endDiff) ||
        (repeatFrequency === 4 &&
          ((startDiff / 7) % 13 === 0 || (endDiff / 7) % 13 === 0)) ||
        (repeatFrequency === 5 && 365 >= startDiff && 365 <= endDiff))
    );
  };
};

const handleDailyEntries = ([start, end], requiresDailyDuplication, tasks) => {
  const startDoW = Days[new Date(start).getDay()];
  const reduction = requiresDailyDuplication
    ? c => Days.map(dayOfWeek => ({ ...c, dayOfWeek }))
    : c => [{ ...c, dayOfWeek: startDoW }];

  const processedDailyTasks = tasks
    .filter(x => x.repeatFrequency === 1)
    .reduce((p, c) => [...p, ...reduction(c)], []);

  return [
    ...tasks.filter(x => x.repeatFrequency !== 1),
    ...processedDailyTasks
  ];
};

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
    return false;
  }

  setupPorts(ports) {
    this.ports = ports;
    this.ports.fetch.subscribe(this.handleFetch);
    this.ports.create.subscribe(this.handleCreate);
    this.ports.update.subscribe(this.handleUpdate);
    this.ports.delete.subscribe(this.handleDelete);
  }

  handleFetch({ timePeriod, targetDate }) {
    let range;
    if (timePeriod === Strings.timePeriod.day) {
      range = [formatDateForInput(targetDate), formatDateForInput(targetDate)];
    } else if (timePeriod === Strings.timePeriod.week) {
      range = [
        formatDateForInput(weekBeginning(targetDate)),
        formatDateForInput(weekEnding(targetDate))
      ];
    }

    const query = {
      dateRange: range
    };

    getTasks(TaskQL.getTasksForDateRange(query)).then(result => {
      const { tasks } = result.data;

      this.ports.tasks.send(
        handleDailyEntries(
          range,
          timePeriod === Strings.timePeriod.week,
          tasks
            .filter(temporaryClientSideFilter(range))
            .map(({ repeatDay, ...task }) => ({
              ...task,
              repeatDay: formatDateForInput(repeatDay)
            }))
        )
      );
    });
  }

  handleCreate({ id, ...task }) {
    const data = fixRepeatDay(task);
    const newTask = constructRecordForPost(data);

    mutateTasks(TaskML.createTask(newTask)).then(result =>
      this.ports.task.send(result.data.createdTask.record)
    );
  }

  handleUpdate({ id, ...task }) {
    const data = { _id: id, ...fixRepeatDay(task) };
    const updatedTask = constructRecordForPost(data);

    mutateTasks(TaskML.updateTaskById(updatedTask)).then(result =>
      this.ports.task.send(result.data.updatedTask.record)
    );
  }

  handleDelete(taskId) {
    mutateTasks(TaskML.deleteTask(taskId));
  }

  render() {
    return (
      <div id="yoruichi" className="flex-column">
        <ElmWrapper src={Main} ports={this.setupPorts} />
      </div>
    );
  }
}

export default Home;
