import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';

import { SimpleLoading } from 'mko';
import { Strings } from '../../constants/values';
import {
  mapStateToEntityList,
  mapUrlFilterToEntityObject
} from '../../utils/data';
import { loadAnime } from '../../actions/anime';

const BaseListView = Loadable({
  loader: () => import(/* webpackChunkName: 'ItemList' */ '../BaseList'),
  loading: SimpleLoading,
  delay: 300
});

const Anime = ({ location, filter, items, loadAnime }) => (
  <BaseListView
    routeKey={location.key}
    type={Strings.anime}
    loadDataForTypedList={loadAnime}
    items={items}
    statusFilter={filter}
  />
);

Anime.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  filter: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  items: mapStateToEntityList(state.entities.anime),
  filter: mapUrlFilterToEntityObject(ownProps.match.params)
});

const mapDispatchToProps = {
  loadAnime
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Anime);
