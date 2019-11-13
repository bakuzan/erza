import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { nano } from 'meiko/styles/nano';
import DateSelector from 'meiko/DateSelector';
import MultiSelect from 'meiko/MultiSelect';
import SelectBox from 'meiko/SelectBox';
import ContentTypeFilters from 'components/ContentTypeFilters';
import SortOrderToggle from 'components/SortOrderToggle';
import { lazyLoader } from 'components/LazyLoaders';
import LoadableContent from 'containers/LoadableContent';
import { nextPage } from 'actions/paging';
import { loadChaptersByDateRange } from 'actions/chapter';
import { loadEpisodesByDateRange } from 'actions/episode';
import Paths from 'constants/paths';
import Strings from 'constants/strings';
import breakpoints from 'styles/nano/media';

import {
  getTimeoutSeconds,
  debounce,
  capitalise,
  startOfDay,
  endOfDay,
  formatDateForInput
} from 'utils';
import { getHistoryNameForItemType, mapStateToEntityList } from 'utils/data';

const PagedHistoryList = lazyLoader(() =>
  import(
    /* webpackChunkName: 'PagedHistoryList' */ '../containers/PagedHistoryList'
  )
);

nano.put('.paged-history--lifted', {
  marginTop: `-41px`,
  ...breakpoints.get('xs')({
    marginTop: `0`
  }),
  ...breakpoints.get('xxs')({
    marginTop: `0`
  })
});

const KEEP_PAGE_ON_MOUNT = false;

const SORT_OPTIONS = [
  { text: 'Date', value: 'date' },
  { text: 'Rating', value: 'rating' }
];

const RATING_OPTIONS = Array(10)
  .fill(null)
  .map((_, i) => ({ value: i + 1, text: `${i + 1}` }));

class HistoryView extends Component {
  constructor(props) {
    super(props);

    const initDate = new Date();
    this.state = {
      displayList: false,
      sortKey: 'date',
      sortOrder: 'DESC',
      from: formatDateForInput(startOfDay(initDate)),
      to: formatDateForInput(endOfDay(initDate)),
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
    this.fetchHistoryPage(this.props, this.state, KEEP_PAGE_ON_MOUNT);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.isAdult !== this.props.isAdult ||
      prevProps.type !== this.props.type ||
      prevProps.size !== this.props.size
    ) {
      this.fetchHistoryPage(this.props, this.state);
    }
  }

  fetchHistoryPage(props, { displayList, ...state }, shouldKeepPage = false) {
    const loadHistory =
      props.type === Strings.anime
        ? props.loadEpisodesByDateRange
        : props.loadChaptersByDateRange;

    loadHistory({ ...state }, shouldKeepPage);
  }

  fetchData() {
    debounce(
      () => this.fetchHistoryPage(this.props, this.state),
      getTimeoutSeconds(1)
    );
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
      <div className="flex flex--column padding-5">
        <Helmet>
          <title>{`${capitalise(type)} History`}</title>
        </Helmet>
        <ContentTypeFilters baseUrl={`${Paths.base}${Paths.history}`} />
        <div className="flex flex--row">
          <div className="filters-container filters-container--wider">
            <div>
              <DateSelector
                id="from"
                name="from"
                label="from"
                required
                value={this.state.from}
                beforeDate={this.state.to}
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
              className="paged-history paged-history--lifted paged-history--column-on-small"
              type={type}
              filters={filters}
              items={historyItems}
              onLoadMore={this.handleLoadMore}
            />
          </LoadableContent>
        </div>
      </div>
    );
  }
}

HistoryView.propTypes = {
  type: PropTypes.string.isRequired,
  isAdult: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(PropTypes.object),
  size: PropTypes.number.isRequired
};

function mapStateToProps(state, ownProps) {
  const type = ownProps.match.params.type;
  const items = mapStateToEntityList(
    type === Strings.anime ? state.entities.episode : state.entities.chapter
  );

  return {
    isFetching: state.isFetching,
    isAdult: state.isAdult,
    type,
    items,
    ...state.paging[getHistoryNameForItemType(type)]
  };
}

const mapDispatchToProps = {
  onLoadMore: nextPage,
  loadChaptersByDateRange,
  loadEpisodesByDateRange
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HistoryView);
