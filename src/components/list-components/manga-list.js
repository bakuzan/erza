import PropTypes from 'prop-types';
import React from 'react';
import ItemList from './item-list/item-list';
import ItemListItem from './item-list/item-list-item';
import withAsyncPageLoad from './withAsyncPageLoad';
import { Strings } from '../../constants/values';

const MangaList = ({ items, addChapter, ...props }) => (
  <ItemList
    {...props}
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

export default withAsyncPageLoad(MangaList);
