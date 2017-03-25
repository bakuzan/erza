import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'
import ListFilter from '../../components/list-filter/list-filter'
import AnimeList from '../../components/anime-list/anime-list'
import {toggleSortOrder, setSortKey} from '../../actions/list-settings'
import {Strings, Enums} from '../../constants/values'

class Anime extends Component {

  constructor() {
    super();
    this.state = {
      search: ''
    };

    this.handleUserInput = this.handleUserInput.bind(this);
  }

  handleUserInput(event) {
    const { name, type, value, checked } = event.target;
    const newValue = type === Strings.checkbox ? checked : value;
    this.setState({ [name]: newValue });
  }

  render() {
    const searchString = this.state.search.toLowerCase();
    const items = this.props.items.filter(x => x.title.toLowerCase().indexOf(searchString) > -1);

    return (
      <div className="flex-row">
        <ListFilter
            search={this.state.search}
            onChange={this.handleUserInput}
            sortOrder={this.props.sortOrder}
            sortOrderToggle={this.props.onSortOrderToggle}
            sortKey={this.props.sortKey}
            sortKeyChange={this.props.onChangeSortKey}
        />
        {
          items && !!items.length &&
          <AnimeList
              items={items}
          />
        }
      </div>
    );
  }

}

Anime.PropTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  sortOrder: PropTypes.string.isRequired,
  sortKey: PropTypes.string.isRequired
}

const getVisibleAnime = (anime, filter) => {
  if (!anime || !anime.allIds.length) return Array(0);
  const animeItems = anime.allIds.map(id => anime.byId[id]);
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
  items: sortVisibleAnime(state.sorting, getVisibleAnime(state.entities.anime, ownProps.params.filter)),
  sortOrder: state.sorting.sortOrder,
  sortKey: state.sorting.sortKey
})

const mapDispatchToProps = ({
  onSortOrderToggle: toggleSortOrder,
  onChangeSortKey: setSortKey
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Anime)
