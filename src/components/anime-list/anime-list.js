import React, {PropTypes} from 'react'
import AnimeListItem from '../anime-list-item/anime-list-item'
import './anime-list.css'

const AnimeList = ({ items, addEpisode }) => (
  <ul className="anime-list">
    {
      items.length === 0 ? (
        <li>
          <p>No items to display.</p>
        </li>
      ) :
      items.map(item => (
        <AnimeListItem
          key={item._id}
          item={item}
          addEpisode={addEpisode}
        />
      ))
    }
  </ul>
);

AnimeList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  addEpisode: PropTypes.func
}

export default AnimeList
