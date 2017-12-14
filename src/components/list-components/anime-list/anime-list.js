import PropTypes from 'prop-types';
import React from 'react';
import ItemList from '../item-list/item-list'
import ItemListItem from '../item-list/item-list-item'
import {Strings} from '../../../constants/values'

const AnimeList = ({ items, addEpisode }) => (
  <ItemList
    items={
      items.map(item => (
        <ItemListItem
          key={item._id}
          type={Strings.anime}
          item={item}
          addAction={addEpisode}
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
