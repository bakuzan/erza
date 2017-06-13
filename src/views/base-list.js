import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'
import LoadingSpinner from '../components/loading-spinner/loading-spinner'
import ListFilter from '../containers/list-filter/list-filter'
import PagedAnimeList from '../containers/paged-anime-list/paged-anime-list'
import PagedMangaList from '../containers/paged-manga-list/paged-manga-list'
import {Strings, Enums} from '../constants/values'
import {getEventValue, getTimeoutSeconds, debounce} from '../utils/common'
// import {mapStateToEntityList} from '../utils/data'

const getStatusList = props => {
  const { name, value } = props.statusFilter;
  console.log(name, value);
  let statusIn = !!value && !!value.length ? value : [value];
  return (name === Strings.filters.ongoing) ? statusIn.concat([Enums.status.onhold]) : statusIn;
}

const loadData = (props, state) => {
  const statusIn = getStatusList(props);
  props.loadDataForTypedList({ statusIn, ...state });
}

const fetchPagedListForType = type => type === Strings.anime
                                      ? PagedAnimeList
                                      : type === Strings.manga
                                        ? PagedMangaList
                                        : null;

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

  componentWillReceiveProps(nextProps) {
    console.log('%c BASE LIST (will receive props) >> ', 'font-size: 18px; font-weight: bold; color: indigo', nextProps, this.props);
    if (
      nextProps.routeKey !== this.props.routeKey ||
      nextProps.statusFilter.value !== this.props.statusFilter.value ||
      nextProps.isAdult !== this.props.isAdult ||
      nextProps.sortKey !== this.props.sortKey ||
      nextProps.sortOrder !== this.props.sortOrder ||
      nextProps.itemsPerPage !== this.props.itemsPerPage
    ) {
      loadData(nextProps, this.state)
    }
  }

  handleUserInput({ target }) {
    const newValue = getEventValue(target);
    this.setState({ [target.name]: newValue });
    debounce(() => loadData(this.props, this.state), getTimeoutSeconds(0.5));
  }

  render() {
    const { type, items } = this.props;
    const PagedTypedList = fetchPagedListForType(type);
    const filters = { ...this.state, statusIn: getStatusList(this.props) };

    return (
      <div className="flex-row">
        <ListFilter
            type={type}
            search={this.state.search}
            onChange={this.handleUserInput}
        />
        {
          this.props.isFetching &&
          <LoadingSpinner size="fullscreen" />
        }
        {
          !this.props.isFetching &&
          <PagedTypedList
              filters={filters}
              items={items}
           />
        }
      </div>
    );
  }

}

BaseListView.propTypes = {
  routeKey: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isAdult: PropTypes.bool.isRequired,
  sortOrder: PropTypes.string.isRequired,
  sortKey: PropTypes.string.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  statusFilter: PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  isFetching: state.isFetching,
  isAdult: state.isAdult,
  sortOrder: state.sorting.sortOrder,
  sortKey: state.sorting.sortKey,
  itemsPerPage: state.paging.itemsPerPage
})

export default connect(
  mapStateToProps
)(BaseListView)
