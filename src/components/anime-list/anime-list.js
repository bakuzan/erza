import React, {PropTypes} from 'react'
import {Link} from 'react-router'
import {Paths} from '../../constants/paths'
import './anime-list.css'

const AnimeList = ({ items }) => {
  return (
    <ul className="anime-list">
      {
        items.length === 0 ? (
          <li>
            <p>No items to display.</p>
          </li>
        ) :
        items.map(item => (
          <li key={item.id} className="anime-item">
            { item.title }
            <Link to={`${Paths.base}${Paths.anime.edit}${item.id}`}>
              Edit
            </Link>
          </li>
        ))
      }
    </ul>
  );
}

AnimeList.PropTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default AnimeList
