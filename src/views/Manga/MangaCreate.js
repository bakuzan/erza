import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { lazyLoader } from 'components/LazyLoaders';
import {
  loadMangaByIdForEdit,
  createManga,
  editManga
} from '../../actions/manga';
import { Strings } from '../../constants/values';

const BaseCreate = lazyLoader(() =>
  import(/* webpackChunkName: 'ItemCreation' */ '../BaseCreate')
);

const MangaCreate = ({ itemId, loadById, create, edit, ...props }) => (
  <BaseCreate
    type={Strings.manga}
    itemId={itemId}
    location={props.location}
    actions={{
      loadById,
      create,
      edit
    }}
  />
);

MangaCreate.propTypes = {
  itemId: PropTypes.string
};

const mapStateToProps = (state, ownProps) => ({
  itemId: ownProps.match.params.id
});

const mapDispatchToProps = {
  loadById: loadMangaByIdForEdit,
  create: createManga,
  edit: editManga
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MangaCreate);
