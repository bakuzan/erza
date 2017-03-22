import React, {PropTypes} from 'react'
import { connect } from 'react-redux'
import ListFilter from '../../components/list-filter/list-filter'
import AnimeList from '../../components/anime-list/anime-list'
import {Strings, Enums} from '../../constants/values'

let Anime = ({ params, items }) => (
  <div>
    <ListFilter />
    {
      items && !!items.length &&
      <AnimeList
          items={items}
      />
    }
  </div>
)

Anime.PropTypes = {
  items: PropTypes.arrayOf(function(propValue, key, componentName, location, propFullName) {
    console.log(propValue, key, componentName, location, propFullName);
    if (!/matchme/.test(propValue[key])) {
      return new Error(
        'Invalid prop `' + propFullName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  })
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
      throw new Error('Unknown filter: ' + filter)
  }
}

const mapStateToProps = (state, ownProps) => ({
  items: getVisibleAnime(state.entities.anime, ownProps.params.filter)
})

// const mapDispatchToProps = ({
//   onTodoClick: toggleTodo
// })

Anime = connect(
  mapStateToProps
)(Anime)

export default Anime
