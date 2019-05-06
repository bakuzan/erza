import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { DateSelector, MultiSelect, SelectBox } from 'mko';
import SortOrderToggle from 'components/SortOrderToggle';
import { lazyLoader } from 'components/LazyLoaders';
import LoadableContent from 'containers/LoadableContent';
import { nextPage } from 'actions/paging';

import {
  getTimeoutSeconds,
  debounce,
  capitalise,
  startOfDay,
  endOfDay,
  formatDateForInput
} from 'utils';
import { getHistoryNameForItemType } from 'utils/data';

const PagedHistoryList = lazyLoader(() =>
  import(/* webpackChunkName: 'PagedHistoryList' */ '../../containers/PagedHistoryList')
);

const KEEP_PAGE_ON_MOUNT = false;

const SORT_OPTIONS = [
  { text: 'Date', value: 'date' },
  { text: 'Rating', value: 'rating' }
];

const RATING_OPTIONS = Array(10)
  .fill(null)
  .map((_, i) => ({ value: i + 1, text: `${i + 1}` }));

const dateRangeForQuery = (from = new Date(), to = new Date()) => ({
  from: startOfDay(from),
  to: endOfDay(to)
});

const loadData = (props, { displayList, ...state }, shouldKeepPage = false) =>
  props.loadHistory({ ...state }, shouldKeepPage);

class BaseHistoryView extends Component {
  constructor(props) {
    super(props);
    const dr = dateRangeForQuery();
    this.state = {
      displayList: false,
      sortKey: 'date',
      sortOrder: 'DESC',
      from: formatDateForInput(dr.from),
      to: formatDateForInput(dr.to),
      ratings: []
    };

    this.handleDateInput = this.handleDateInput.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleRatingList = this.handleRatingList.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
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
      prevProps.size !== this.props.size
    ) {
      loadData(this.props, this.state);
    }
  }

  fetchData() {
    debounce(() => loadData(this.props, this.state), getTimeoutSeconds(1));
  }

  handleDateInput(date, name, hasError) {
    if (hasError) {
      return;
    }

    this.setState({ [name]: date }, this.fetchData);
  }

  handleUserInput(event) {
    const { value, name } = event.target;
    this.setState({ [name]: value }, this.fetchData);
  }

  handleRatingList(ratings) {
    this.setState({ ratings }, this.fetchData);
  }

  handleLoadMore() {
    const { isFetching, type, pageInfo, onLoadMore } = this.props;

    if (!isFetching && pageInfo.hasMore) {
      const historyType = getHistoryNameForItemType(type);
      onLoadMore(historyType, this.state);
    }
  }

  render() {
    const { items, type } = this.props;
    const { displayList, ...filters } = this.state;
    const historyItems = displayList ? items : [];

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
              onChange={this.handleDateInput}
            />
            <DateSelector
              id="to"
              name="to"
              label="to"
              required
              value={this.state.to}
              afterDate={this.state.from}
              onChange={this.handleDateInput}
            />
          </div>
          <MultiSelect
            id="ratings"
            name="ratings"
            label="Ratings"
            placeholder="Filter on rating"
            values={filters.ratings}
            options={RATING_OPTIONS}
            onUpdate={this.handleRatingList}
          />
          <SelectBox
            id="sortKey"
            name="sortKey"
            text="sort on"
            value={filters.sortKey}
            onChange={this.handleUserInput}
            options={SORT_OPTIONS}
          />
          <SortOrderToggle
            value={filters.sortOrder}
            onChange={this.handleUserInput}
          />
        </div>
        <LoadableContent>
          <PagedHistoryList
            type={type}
            filters={filters}
            items={historyItems}
            onLoadMore={this.handleLoadMore}
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
  size: PropTypes.number.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  isFetching: state.isFetching,
  isAdult: state.isAdult,
  ...state.paging[getHistoryNameForItemType(ownProps.type)]
});

const mapDispatchToProps = {
  onLoadMore: nextPage
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseHistoryView);
