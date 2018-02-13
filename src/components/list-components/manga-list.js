import PropTypes from 'prop-types';
import React from 'react';
import ItemList from './item-list/item-list';
import ItemListItem from './item-list/item-list-item';
import { Strings } from '../../constants/values';

const MangaList = ({ items, addChapter }) => (
  <ItemList
    items={items.map(item => (
      <ItemListItem
        key={item._id}
        type={Strings.manga}
        item={item}
        addAction={addChapter}
      />
    ))}
  />
);

MangaList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  addChapter: PropTypes.func
};

export default MangaList;
