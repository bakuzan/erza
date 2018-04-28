import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import LoadableContent from 'containers/loadable-content';
import PagedHistoryList from 'containers/paged-history-list/paged-history-list';

import { getEventValue, getTimeoutSeconds, debounce } from 'utils/common';
import { startOfDay, endOfDay, dateAsMs, formatDateForInput } from 'utils/date';
import { getHistoryNameForItemType } from 'utils/data';

const dateRangeForQuery = (from = new Date(), to = new Date()) => [
  dateAsMs(startOfDay(from)),
  dateAsMs(endOfDay(to))
];
const KEEP_PAGE_ON_MOUNT = true;
const loadData = (props, state, shouldKeepPage = false) =>
  props.loadHistory(
    { dateRange: dateRangeForQuery(state.from, state.to) },
    shouldKeepPage
  );

const Datepicker = ({ label, ...props }) => (
  <div className="has-float-label input-container">
    <input type="date" placeholder=" " {...props} />
    <label>{label}</label>
  </div>
);

class BaseHistoryView extends Component {
  constructor(props) {
    super(props);
    const dr = dateRangeForQuery();
    this.state = {
      from: formatDateForInput(dr[0]),
      to: formatDateForInput(dr[1])
    };

    this.handleUserInput = this.handleUserInput.bind(this);
  }

  componentDidMount() {
    loadData(this.props, this.state, KEEP_PAGE_ON_MOUNT);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.isAdult !== this.props.isAdult ||
      prevProps.type !== this.props.type ||
      prevProps.itemsPerPage !== this.props.itemsPerPage
    ) {
      loadData(this.props, this.state);
    }
  }

  handleUserInput({ target }) {
    const newValue = getEventValue(target);
    this.setState({ [target.name]: newValue });
    debounce(() => loadData(this.props, this.state), getTimeoutSeconds(1));
  }

  render() {
    const { items, type } = this.props;
    const filters = {
      dateRange: dateRangeForQuery(this.state.from, this.state.to)
    };

    return (
      <div className="flex-row">
        <div className="filters-container">
          <div>
            <Datepicker
              name="from"
              label="from"
              value={this.state.from}
              onChange={this.handleUserInput}
            />
            <Datepicker
              name="to"
              label="to"
              value={this.state.to}
              min={this.state.from}
              onChange={this.handleUserInput}
            />
          </div>
        </div>
        <LoadableContent>
          <PagedHistoryList type={type} filters={filters} items={items} />
        </LoadableContent>
      </div>
    );
  }
}

BaseHistoryView.propTypes = {
  type: PropTypes.string.isRequired,
  isAdult: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(PropTypes.object),
  loadHistory: PropTypes.func.isRequired,
  itemsPerPage: PropTypes.number.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  isAdult: state.isAdult,
  itemsPerPage:
    state.paging[getHistoryNameForItemType(ownProps.type)].itemsPerPage
});

export default connect(mapStateToProps)(BaseHistoryView);
