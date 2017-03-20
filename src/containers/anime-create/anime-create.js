import React from 'react'
import { connect } from 'react-redux'
import { createAnime } from '../../actions/index'
import { Strings } from '../../constants/strings'

let AnimeCreate = ({ dispatch }) => (
  <div>
    <form name="animeForm" noValidate="" onSubmit={ event => {
      event.preventDefault();
      console.log(event);
      dispatch(createAnime());
    }}>
      <div className="has-float-label text-input-container">
        <input type="text"
               name="title"
               placeholder="title"
               autoFocus
         />
        <label>title</label>
      </div>

      <button type="submit">
      { Strings.create }
      </button>
    </form>
  </div>
)

AnimeCreate = connect()(AnimeCreate)

export default AnimeCreate
