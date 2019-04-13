import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { lazyLoader } from 'components/LazyLoaders';
import { loadMangaById, createManga, editManga } from '../../actions/manga';
import { Strings } from '../../constants/values';

const BaseCreate = lazyLoader(() =>
  import(/* webpackChunkName: 'ItemCreation' */ '../BaseCreate')
);

const MangaCreate = ({
  itemId,
  loadMangaById,
  createManga,
  editManga,
  ...props
}) => (
  <BaseCreate
    type={Strings.manga}
    itemId={itemId}
    location={props.location}
    actions={{
      loadById: loadMangaById,
      create: createManga,
      edit: editManga
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
  loadMangaById,
  createManga,
  editManga
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MangaCreate);
