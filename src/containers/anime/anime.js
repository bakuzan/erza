import React from 'react'
import { connect } from 'react-redux'
import AnimeList from '../../components/anime-list/anime-list'

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

const getVisibleAnime = (anime, filter) => {
  if (!anime || !anime.allIds.length) return Array(0);
  switch (filter) {
    case 'all':
    case 'completed':
    case 'ongoing':
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
