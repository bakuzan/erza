import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';

import Loaders from '../../components/loaders/index';
import { loadAnimeById, createAnime, editAnime } from '../../actions/anime';
import { Strings } from '../../constants/values';

const BaseCreate = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'item-creation' */ '../base-create'),
  loading: Loaders.Loadables.SimpleLoading,
  delay: 300
});

const AnimeCreate = ({
  itemId,
  loadAnimeById,
  createAnime,
  editAnime,
  ...props
}) => (
  <BaseCreate
    type={Strings.anime}
    itemId={itemId}
    location={props.location}
    actions={{
      loadById: loadAnimeById,
      create: createAnime,
      edit: editAnime
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
  loadAnimeById,
  createAnime,
  editAnime
};

export default connect(mapStateToProps, mapDispatchToProps)(AnimeCreate);
