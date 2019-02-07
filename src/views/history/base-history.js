import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import { Helmet } from 'react-helmet';

import { Loaders, Utils } from 'meiko';
import DateSelector from 'components/date-selector';
import LoadableContent from 'containers/loadable-content';

import { getTimeoutSeconds, debounce, capitalise } from 'utils/common';
import { getHistoryNameForItemType } from 'utils/data';

const { startOfDay, endOfDay, DateFormat } = Utils.Date;

const PagedHistoryList = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'history-list' */ '../../containers/paged-history-list/paged-history-list'),
  loading: Loaders.Loadables.SimpleLoading,
  delay: 300
});

const dateRangeForQuery = (from = new Date(), to = new Date()) => [
  DateFormat.dateAsMs(startOfDay(from)),
  DateFormat.dateAsMs(endOfDay(to))
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
      from: DateFormat.formatDateForInput(dr[0]),
      to: DateFormat.formatDateForInput(dr[1])
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
      <div className="flex-row">
        <Helmet>
          <title>{`${capitalise(type)} History`}</title>
        </Helmet>
        <div className="filters-container">
          <div>
            <DateSelector
              name="from"
              label="from"
              required
              value={this.state.from}
              onChange={this.handleUserInput}
            />
            <DateSelector
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
