import React, {PropTypes} from 'react'
import ItemList from '../item-list/item-list'
import AnimeListItem from './anime-list-item'

const AnimeList = ({ items, addEpisode }) => (
  <ItemList
    items={
      items.map(item => (
        <AnimeListItem
          key={item._id}
          item={item}
          addEpisode={addEpisode}
        />
      ))
    }
  />
);

AnimeList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  addEpisode: PropTypes.func
}

export default AnimeList
