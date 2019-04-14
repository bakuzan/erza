import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { DateSelector } from 'mko';
import { lazyLoader } from 'components/LazyLoaders';
import LoadableContent from 'containers/LoadableContent';

import {
  getTimeoutSeconds,
  debounce,
  capitalise,
  startOfDay,
  endOfDay,
  dateAsMs,
  formatDateForInput
} from 'utils';
import { getHistoryNameForItemType } from 'utils/data';

const PagedHistoryList = lazyLoader(() =>
  import(/* webpackChunkName: 'PagedHistoryList' */ '../../containers/PagedHistoryList')
);

const dateRangeForQuery = (from = new Date(), to = new Date()) => [
  dateAsMs(startOfDay(from)),
  dateAsMs(endOfDay(to))
];
const KEEP_PAGE_ON_MOUNT = false;
const loadData = (props, state, shouldKeepPage = false) =>
  props.loadHistory(
    { dateRange: dateRangeForQuery(state.from, state.to) },
    shouldKeepPage
  );

class BaseHistoryView extends Component {
  constructor(props) {
    super(props);
    const dr = dateRangeForQuery();
    this.state = {
      displayList: false,
      from: formatDateForInput(dr[0]),
      to: formatDateForInput(dr[1])
    };

    this.handleUserInput = this.handleUserInput.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState.displayList && !nextProps.page) {
      return { displayList: true };
    }

    return null;
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

  handleUserInput(date, name, hasError) {
    if (hasError) return;
    this.setState({ [name]: date }, () =>
      debounce(() => loadData(this.props, this.state), getTimeoutSeconds(1))
    );
  }

  render() {
    const { items, type } = this.props;
    const filters = {
      dateRange: dateRangeForQuery(this.state.from, this.state.to)
    };
    const historyItems = this.state.displayList ? items : [];

    return (
      <div className="flex flex--row">
        <Helmet>
          <title>{`${capitalise(type)} History`}</title>
        </Helmet>
        <div className="filters-container filters-container--wider">
          <div>
            <DateSelector
              id="from"
              name="from"
              label="from"
              required
              value={this.state.from}
              onChange={this.handleUserInput}
            />
            <DateSelector
              id="to"
              name="to"
              label="to"
              required
              value={this.state.to}
              afterDate={this.state.from}
              onChange={this.handleUserInput}
            />
          </div>
        </div>
        <LoadableContent>
          <PagedHistoryList
            type={type}
            filters={filters}
            items={historyItems}
          />
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
  ...state.paging[getHistoryNameForItemType(ownProps.type)]
});

export default connect(mapStateToProps)(BaseHistoryView);
