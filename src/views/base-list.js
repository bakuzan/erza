import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';

import Loaders from '../components/loaders/index';
import LoadableContent from '../containers/loadable-content';
import ListFilter from '../containers/list-filter/list-filter';
import PagedAnimeList from '../containers/paged-lists/paged-anime-list';
import PagedMangaList from '../containers/paged-lists/paged-manga-list';
import { Strings } from '../constants/values';
import { getEventValue, getTimeoutSeconds, debounce } from '../utils/common';

const getStatusList = props => {
  const { value } = props.statusFilter;
  return !!value && !!value.length ? value : [value];
};

const loadData = (props, state) => {
  const statusIn = getStatusList(props);
  props.loadDataForTypedList({
    statusIn,
    isOwnedOnly: props.isOwnedOnly,
    ...state
  });
};

const fetchPagedListForType = type =>
  type === Strings.anime
    ? PagedAnimeList
    : type === Strings.manga ? PagedMangaList : null;

const DailyAnime = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'daily-anime' */ '../containers/daily-anime/daily-anime'),
  loading: Loaders.Loadables.SimpleLoading,
  delay: 300
});

class BaseListView extends Component {
  constructor() {
    super();
    this.state = {
      search: ''
    };

    this.handleUserInput = this.handleUserInput.bind(this);
  }

  componentDidMount() {
    loadData(this.props, this.state);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.routeKey !== this.props.routeKey ||
      prevProps.statusFilter.value !== this.props.statusFilter.value ||
      prevProps.isAdult !== this.props.isAdult ||
      prevProps.sortKey !== this.props.sortKey ||
      prevProps.sortOrder !== this.props.sortOrder ||
      prevProps.itemsPerPage !== this.props.itemsPerPage
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
      statusIn: getStatusList(this.props),
      isOwnedOnly
    };

    return (
      <div className="flex-row">
        <ListFilter
          type={type}
          search={this.state.search}
          onChange={this.handleUserInput}
        >
          {type === Strings.anime &&
            !isAdult && (
              <DailyAnime routeKey={routeKey} onSelect={this.handleUserInput} />
            )}
        </ListFilter>
        <LoadableContent>
          <PagedTypedList filters={filters} items={items} />
        </LoadableContent>
      </div>
    );
  }
}

BaseListView.propTypes = {
  routeKey: PropTypes.string.isRequired,
  isAdult: PropTypes.bool.isRequired,
  sortOrder: PropTypes.string.isRequired,
  sortKey: PropTypes.string.isRequired,
  itemsPerPage: PropTypes.object.isRequired,
  statusFilter: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  isAdult: state.isAdult,
  sortOrder: state.sorting.sortOrder,
  sortKey: state.sorting.sortKey,
  isOwnedOnly: state.filters[ownProps.type].isOwnedOnly,
  itemsPerPage: state.paging.itemsPerPage
});

export default connect(mapStateToProps)(BaseListView);
