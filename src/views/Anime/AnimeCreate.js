import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';

import { SimpleLoading } from 'mko';
import {
  loadAnimeByIdForEdit,
  createAnime,
  editAnime
} from '../../actions/anime';
import { checkAnimeExists } from 'erzaGQL/query';
import { Strings } from '../../constants/values';

const BaseCreate = Loadable({
  loader: () => import(/* webpackChunkName: 'ItemCreation' */ '../BaseCreate'),
  loading: SimpleLoading,
  delay: 300
});

const AnimeCreate = ({
  itemId,
  loadById,
  create,
  edit,
  checkSeriesExists,
  ...props
}) => (
  <BaseCreate
    type={Strings.anime}
    itemId={itemId}
    location={props.location}
    actions={{
      loadById,
      create,
      edit,
      checkSeriesExists
    }}
  />
);

AnimeCreate.propTypes = {
  itemId: PropTypes.string
};

const mapStateToProps = (state, ownProps) => ({
  itemId: ownProps.match.params.id
});

const mapDispatchToProps = {
  loadById: loadAnimeByIdForEdit,
  create: createAnime,
  edit: editAnime,
  checkSeriesExists: checkAnimeExists
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnimeCreate);
