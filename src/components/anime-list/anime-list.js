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
            <time dateTime={item.updatedDate}>{ item.updatedDate }</time>
            <h4>
              { item.title }
            </h4>
            <Link to={`${Paths.base}${Paths.anime.edit}${item.id}`}>
              Edit
            </Link>
          </li>
        ))
      }
    </ul>
  );
}

AnimeList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default AnimeList
