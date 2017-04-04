import React, {PropTypes} from 'react'
import {Link} from 'react-router'
import {Paths} from '../../constants/paths'
import {formatDateForDisplay} from '../../utils/common'
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
            <div>
              <time dateTime={item.updatedDate}>{ formatDateForDisplay(item.updatedDate) }</time>
              <h4>
                { item.title }
              </h4>
              <div className="button-group">
                <Link to={`${Paths.base}${Paths.anime.view}${item.id}`}
                      className="button ripple">
                  View
                </Link>
                <Link to={`${Paths.base}${Paths.anime.edit}${item.id}`}
                      className="button ripple">
                  Edit
                </Link>
              </div>
            </div>
            <div className="series-image-container">
              <img src={item.image} alt={`Cover for ${item.title}`} />
            </div>
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
