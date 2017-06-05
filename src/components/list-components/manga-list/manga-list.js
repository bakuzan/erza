import React, {PropTypes} from 'react'
import ItemList from '../item-list/item-list'
import MangaListItem from './manga-list-item'

const MangaList = ({ items, addChapter }) => (
  <ItemList
    items={
      items.map(item => (
        <MangaListItem
          key={item._id}
          item={item}
          addChapter={addChapter}
        />
      ))
    }
  />
);

MangaList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  addChapter: PropTypes.func
}

export default MangaList
