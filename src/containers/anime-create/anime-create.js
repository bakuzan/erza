import React from 'react'
import { connect } from 'react-redux'
import { createAnime } from '../../actions/index'

let AnimeCreate = ({ dispatch }) => (
  <div>
    <form name="animeForm" noValidate="" onSubmit={
      event.preventDefault()
      console.log(event)
      dispatch(createAnime)
    }>
      <div className="has-float-label text-input-container">
        <input type="text"
               name="title"
               placeholder="title"
               autoFocus
         />
        <label>title</label>
      </div>

      <input type="submit" />
    </form>
  </div>
)

AnimeCreate = connect()(AnimeCreate)

export default AnimeCreate
