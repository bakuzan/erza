import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { DateSelector, MultiSelect } from 'mko';
import { lazyLoader } from 'components/LazyLoaders';
import LoadableContent from 'containers/LoadableContent';

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
const ratingOptions = Array(10)
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
      from: formatDateForInput(dr.from),
      to: formatDateForInput(dr.to),
      ratings: []
    };

    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleRatingList = this.handleRatingList.bind(this);
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

  handleUserInput(date, name, hasError) {
    if (hasError) {
      return;
    }

    this.setState({ [name]: date }, this.fetchData);
  }

  handleRatingList(ratings) {
    this.setState({ ratings }, this.fetchData);
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
          <MultiSelect
            id="ratings"
            name="ratings"
            label="Ratings"
            placeholder="Select ratings"
            values={this.state.ratings}
            options={ratingOptions}
            onUpdate={this.handleRatingList}
          />
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
  size: PropTypes.number.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  isAdult: state.isAdult,
  ...state.paging[getHistoryNameForItemType(ownProps.type)]
});

export default connect(mapStateToProps)(BaseHistoryView);
