import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { lazyLoader } from 'components/LazyLoaders';
import LoadableContent from 'containers/LoadableContent';
import ListFilter from 'containers/ListFilter';
import PagedAnimeList from 'containers/PagedLists/PagedAnimeList';
import PagedMangaList from 'containers/PagedLists/PagedMangaList';
import { Strings } from 'constants/values';
import { getEventValue, getTimeoutSeconds, debounce, capitalise } from 'utils';

const getStatusList = (props) => {
  const { value } = props.statusFilter;
  return !!value && !!value.length ? value : [value];
};

const KEEP_PAGE_ON_MOUNT = true;
const loadData = (props, state, shouldKeepPage = false) => {
  const status = getStatusList(props);
  props.loadDataForTypedList(
    {
      status,
      isOwnedOnly: props.isOwnedOnly,
      ...state
    },
    shouldKeepPage
  );
};

const fetchPagedListForType = (type) =>
  type === Strings.anime
    ? PagedAnimeList
    : type === Strings.manga
    ? PagedMangaList
    : null;

const DailyAnime = lazyLoader(() =>
  import(/* webpackChunkName: 'DailyAnime' */ '../containers/DailyAnime')
);

class BaseListView extends Component {
  constructor() {
    super();
    this.state = {
      search: ''
    };

    this.handleUserInput = this.handleUserInput.bind(this);
  }

  componentDidMount() {
    loadData(this.props, this.state, KEEP_PAGE_ON_MOUNT);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.routeKey !== this.props.routeKey ||
      prevProps.statusFilter.value !== this.props.statusFilter.value ||
      prevProps.isAdult !== this.props.isAdult ||
      prevProps.sorting !== this.props.sorting ||
      prevProps.itemsPerPage !== this.props.itemsPerPage ||
      prevProps.isOwnedOnly !== this.props.isOwnedOnly
    ) {
      loadData(this.props, this.state);
    }
  }

  handleUserInput({ target }) {
    const newValue = getEventValue(target);
    this.setState({ [target.name]: newValue });
    debounce(() => loadData(this.props, this.state), getTimeoutSeconds(0.5));
  }

  render() {
    const { type, items, isAdult, routeKey, isOwnedOnly } = this.props;
    const PagedTypedList = fetchPagedListForType(type);
    const filters = {
      ...this.state,
      status: getStatusList(this.props),
      isOwnedOnly
    };

    const showDailyAnime = type === Strings.anime && !isAdult;

    return (
      <div className="flex flex--row">
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
          <PagedTypedList filters={filters} items={items} />
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
  itemsPerPage: PropTypes.number.isRequired,
  statusFilter: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  isAdult: state.isAdult,
  sorting: state.sorting,
  isOwnedOnly: state.filters[ownProps.type].isOwnedOnly,
  itemsPerPage: state.paging[ownProps.type].size
});

export default connect(mapStateToProps)(BaseListView);
