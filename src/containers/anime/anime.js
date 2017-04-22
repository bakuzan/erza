import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'
import LoadingSpinner from '../../components/loading-spinner/loading-spinner'
import ListFilter from '../../containers/list-filter/list-filter'
import PagedAnimeList from '../../containers/paged-anime-list/paged-anime-list'
import {Strings, Enums} from '../../constants/values'
import {getEventValue} from '../../utils/common'
import { loadAnime } from '../../actions/anime'

const loadData = (props, state) => {
  const status = Enums.anime.status[props.params.filter];
  props.loadAnime({ status, ...state });
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
    if (
      nextProps.isAdult !== this.props.isAdult ||
      nextProps.sortKey !== this.props.sortKey ||
      nextProps.sortOrder !== this.props.sortOrder
    ) {
      loadData(nextProps, this.state)
    }
  }

  handleUserInput({ target }) {
    const newValue = getEventValue(target);
    this.setState({ [target.name]: newValue });
    loadData(this.props, this.state);
  }

  render() {
    if (this.props.isFetching) return (<LoadingSpinner size="fullscreen" />);
    const searchString = this.state.search.toLowerCase();
    const items = this.props.items.filter(x => x.title.toLowerCase().indexOf(searchString) > -1 && x.isAdult === this.props.isAdult);
    console.log('props => ', this.props, items);
    return (
      <div className="flex-row">
        <ListFilter
            search={this.state.search}
            onChange={this.handleUserInput}
        />
        <PagedAnimeList
            filters={this.state}
            items={items}
         />
      </div>
    );
  }

}

Anime.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  isAdult: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(PropTypes.object),
  sortOrder: PropTypes.string.isRequired,
  sortKey: PropTypes.string.isRequired
}

const getVisibleAnime = (anime, filter) => {
  if (!anime || !anime.allIds.length) return Array(0);
  const animeItems = anime.allIds.map(id => anime.byId[id].node);
  switch (filter) {
    case Strings.filters.all:
      return animeItems;
    case Strings.filters.completed:
      return animeItems.filter(x => x.status === Enums.anime.status.completed);
    case Strings.filters.ongoing:
      return animeItems.filter(x => x.status === Enums.anime.status.ongoing);
    default:
      throw new Error(`getVisibleAnime : Unknown filter type "${filter}"`)
  }
}

const sortVisibleAnime = ({ sortOrder, sortKey }, items) => {
  return items.sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return sortOrder === Strings.ascending ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return sortOrder === Strings.ascending ? 1 : -1;
    return 0;
  })
}

const mapStateToProps = (state, ownProps) => ({
  isFetching: state.isFetching,
  isAdult: state.isAdult,
  items: sortVisibleAnime(state.sorting, getVisibleAnime(state.entities.anime, ownProps.params.filter)),
  sortOrder: state.sorting.sortOrder,
  sortKey: state.sorting.sortKey
})

const mapDispatchToProps = {
  loadAnime
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Anime)
