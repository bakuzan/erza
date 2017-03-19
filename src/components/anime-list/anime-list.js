import React from 'react'

const AnimeList = ({ items }) => (
  <ul className="anime-list">
    {
      items.map(item =>
        <li key={item.id}>
          { item.title }
        </li>
      )
    }
  </ul>
)

export default AnimeList
