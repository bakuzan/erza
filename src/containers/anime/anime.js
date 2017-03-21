import React, {PropTypes} from 'react'
import { connect } from 'react-redux'
import AnimeList from '../../components/anime-list/anime-list'
import {Strings} from '../../constants/strings'

let Anime = ({ params, items }) => (
  <div>
    Add filters
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
  switch (filter) {
    case Strings.filters.all:
    case Strings.filters.completed:
    case Strings.filters.ongoing:
      return anime.allIds.map(id => anime.byId[id]);  
    default:
      throw new Error('Unknown filter: ' + filter)
  }
}

const mapStateToProps = (state, ownProps) => ({
  items: getVisibleAnime(state.anime, ownProps.params.filter)
})

// const mapDispatchToProps = ({
//   onTodoClick: toggleTodo
// })

Anime = connect(
  mapStateToProps
)(Anime)

export default Anime
