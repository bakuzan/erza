import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';

import { Loaders } from 'meiko';
import { loadMangaById, createManga, editManga } from '../../actions/manga';
import { Strings } from '../../constants/values';

const BaseCreate = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'item-creation' */ '../base-create'),
  loading: Loaders.Loadables.SimpleLoading,
  delay: 300
});

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

export default connect(mapStateToProps, mapDispatchToProps)(MangaCreate);
