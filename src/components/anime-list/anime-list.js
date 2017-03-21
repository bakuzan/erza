import React, {PropTypes} from 'react'

const AnimeList = ({ items }) => (
  <ul className="anime-list">
    {
      items.map(item =>
        <li key={item.id} className="anime-item">
          { item.title }
        </li>
      )
    }
  </ul>
)

AnimeList.PropTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default AnimeList
