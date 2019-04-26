import PropTypes from 'prop-types';
import React from 'react';

import ItemList from './ItemList';
import ItemListItem from './ItemList/ItemListItem';
import withAsyncPageLoad from './withAsyncPageLoad';
import { Strings } from 'constants/values';

const MangaList = ({ items, addChapter, ...props }) => (
  <ItemList
    {...props}
    items={items.map((item) => (
      <ItemListItem
        key={item.id}
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
