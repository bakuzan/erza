import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'
import LoadingSpinner from '../../components/loading-spinner/loading-spinner'
import ListFilter from '../../containers/list-filter/list-filter'
import PagedAnimeList from '../../containers/paged-anime-list/paged-anime-list'
import {Strings, Enums} from '../../constants/values'
import {getEventValue, getTimeoutSeconds, debounce} from '../../utils/common'
import {mapStateToEntityList} from '../../utils/data'
import { loadAnime } from '../../actions/anime'

const getStatusList = props => {
  const status = Enums.anime.status[props.params.filter];
  let statusIn = !!status.length ? status : [status];
  return (props.params.filter === Strings.filters.ongoing) ? statusIn.concat([Enums.anime.status.onhold]) : statusIn;
}

const loadData = (props, state) => {
  const statusIn = getStatusList(props);
  props.loadAnime({ statusIn, ...state });
}

class Anime extends Component {

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
    // console.log('%c will get props !! > ', 'font-size: 18px; font-weight: bold; color: indigo', nextProps, this.props);
    if (
      nextProps.isAdult !== this.props.isAdult ||
      nextProps.sortKey !== this.props.sortKey ||
      nextProps.sortOrder !== this.props.sortOrder ||
      nextProps.params.filter !== this.props.params.filter ||
      nextProps.location.key !== this.props.location.key ||
      nextProps.itemsPerPage !== this.props.itemsPerPage
    ) {
      loadData(nextProps, this.state)
    }
  }

  handleUserInput({ target }) {
    const newValue = getEventValue(target);
    this.setState({ [target.name]: newValue });
    debounce(() => loadData(this.props, this.state), getTimeoutSeconds(1));
  }

  render() {
    const { items } = this.props;
    const filters = { ...this.state, statusIn: getStatusList(this.props) };

    return (
      <div className="flex-row">
        <ListFilter
            search={this.state.search}
            onChange={this.handleUserInput}
        />
        {
          this.props.isFetching &&
          <LoadingSpinner size="fullscreen" />
        }
        {
          !this.props.isFetching &&
          <PagedAnimeList
              filters={filters}
              items={items}
           />
        }
      </div>
    );
  }

}

Anime.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  isAdult: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(PropTypes.object),
  sortOrder: PropTypes.string.isRequired,
  sortKey: PropTypes.string.isRequired,
  itemsPerPage: PropTypes.number.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  isFetching: state.isFetching,
  isAdult: state.isAdult,
  items: mapStateToEntityList(state.entities.anime), //sortVisibleAnime(state.sorting, getVisibleAnime(state.entities.anime, ownProps.params.filter)),
  sortOrder: state.sorting.sortOrder,
  sortKey: state.sorting.sortKey,
  itemsPerPage: state.paging.itemsPerPage
})

const mapDispatchToProps = {
  loadAnime
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Anime)
