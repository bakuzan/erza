import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux'

import BaseCreate from '../base-create'
import { loadAnimeById, createAnime, editAnime } from '../../actions/anime'
import {Strings} from '../../constants/values'

const AnimeCreate = ({ itemId, loadAnimeById, createAnime, editAnime }) => (
  <BaseCreate
    type={Strings.anime}
    itemId={itemId}
    actions={{
      loadById: loadAnimeById,
      create: createAnime,
      edit: editAnime
    }}
  />
)

AnimeCreate.propTypes = {
  itemId: PropTypes.string,

}

const mapStateToProps = (state, ownProps) => ({
  itemId: ownProps.match.params.id
})

const mapDispatchToProps = {
  loadAnimeById,
  createAnime,
  editAnime
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnimeCreate)
