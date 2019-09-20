import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { nano } from 'mko';
import { lazyLoader } from 'components/LazyLoaders';
import LoadableContent from 'containers/LoadableContent';
import ListFilter from 'containers/ListFilter';
import PagedAnimeList from 'containers/PagedLists/PagedAnimeList';
import PagedMangaList from 'containers/PagedLists/PagedMangaList';
import { nextPage } from 'actions/paging';
import { Strings } from 'constants/values';
import { getEventValue, getTimeoutSeconds, debounce, capitalise } from 'utils';

const DailyAnime = lazyLoader(() =>
  import(/* webpackChunkName: 'DailyAnime' */ '../containers/DailyAnime')
);

function getStatusList(props) {
  const { value } = props.statusFilter;
  return !!value && !!value.length ? value : [value];
}

function getFilters(state, props) {
  return {
    ...state,
    status: getStatusList(props),
    isOwnedOnly: props.isOwnedOnly
  };
}

const KEEP_PAGE_ON_MOUNT = false;
const loadData = (props, state, shouldKeepPage = false) =>
  props.loadDataForTypedList(getFilters(state, props), shouldKeepPage);

const fetchPagedListForType = (type) =>
  type === Strings.anime
    ? PagedAnimeList
    : type === Strings.manga
    ? PagedMangaList
    : null;

const listClass = nano.rule({
  display: 'flex',
  flexDirection: 'column',
  width: '90%',
  margin: '0 auto'
});

class BaseListView extends Component {
  constructor() {
    super();
    this.state = {
      search: ''
    };

    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
  }

  componentDidMount() {
    loadData(this.props, this.state, KEEP_PAGE_ON_MOUNT);
  }

  componentDidUpdate(prevProps) {
    const {
      routeKey,
      isAdult,
      isOwnedOnly,
      statusFilter,
      sorting,
      paging
    } = this.props;

    if (
      prevProps.routeKey !== routeKey ||
      prevProps.statusFilter.value !== statusFilter.value ||
      prevProps.isAdult !== isAdult ||
      prevProps.sorting !== sorting ||
      prevProps.paging.size !== paging.size ||
      prevProps.isOwnedOnly !== isOwnedOnly
    ) {
      loadData(this.props, this.state);
    }
  }

  handleUserInput({ target }) {
    const newValue = getEventValue(target);
    this.setState({ [target.name]: newValue });
    debounce(() => loadData(this.props, this.state), getTimeoutSeconds(0.5));
  }

  handleLoadMore() {
    const {
      isFetching,
      type,
      paging: { pageInfo },
      onLoadMore
    } = this.props;

    if (!isFetching && pageInfo.hasMore) {
      const filters = getFilters(this.state, this.props);
      onLoadMore(type, filters);
    }
  }

  render() {
    const { type, items, isAdult, routeKey } = this.props;
    const isAnime = type === Strings.anime;
    const showDailyAnime = isAnime && !isAdult;

    const PagedTypedList = fetchPagedListForType(type);
    const filters = getFilters(this.state, this.props);

    return (
      <div id="listPage" className="flex flex--row">
        <Helmet>
          <title>{`${capitalise(type)} List`}</title>
        </Helmet>
        <ListFilter
          routeKey={routeKey}
          type={type}
          search={this.state.search}
          onChange={this.handleUserInput}
        >
          {showDailyAnime && (
            <DailyAnime
              hideOn="small"
              routeKey={routeKey}
              onSelect={this.handleUserInput}
            />
          )}
        </ListFilter>
        <LoadableContent>
          <PagedTypedList
            containerClassName={listClass}
            filters={filters}
            items={items}
            onLoadMore={this.handleLoadMore}
          />
        </LoadableContent>
        {showDailyAnime && (
          <DailyAnime
            hideOn="large"
            routeKey={routeKey}
            onSelect={this.handleUserInput}
          />
        )}
      </div>
    );
  }
}

BaseListView.propTypes = {
  routeKey: PropTypes.string,
  isAdult: PropTypes.bool.isRequired,
  sorting: PropTypes.arrayOf(PropTypes.string).isRequired,
  paging: PropTypes.shape({ size: PropTypes.number, page: PropTypes.number })
    .isRequired,
  statusFilter: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  isFetching: state.isFetching,
  isAdult: state.isAdult,
  sorting: state.sorting,
  isOwnedOnly: state.filters[ownProps.type].isOwnedOnly,
  paging: state.paging[ownProps.type]
});

const mapDispatchToProps = {
  onLoadMore: nextPage
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseListView);
