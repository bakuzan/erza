import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux'

import BaseCreate from '../base-create'
import { loadMangaById, createManga, editManga } from '../../actions/manga'
import {Strings} from '../../constants/values'

const MangaCreate = ({ itemId, loadMangaById, createManga, editManga }) => (
  <BaseCreate
    type={Strings.manga}
    itemId={itemId}
    actions={{
      loadById: loadMangaById,
      create: createManga,
      edit: editManga
    }}
  />
)

MangaCreate.propTypes = {
  itemId: PropTypes.string
}

const mapStateToProps = (state, ownProps) => ({
  itemId: ownProps.match.params.id
})

const mapDispatchToProps = {
  loadMangaById,
  createManga,
  editManga
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MangaCreate)
