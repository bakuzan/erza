import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';

import { SimpleLoading } from '../../components/loadable';
import { Strings } from '../../constants/values';
import {
  mapStateToEntityList,
  mapUrlFilterToEntityObject
} from '../../utils/data';
import { loadManga } from '../../actions/manga';

const BaseListView = Loadable({
  loader: () => import(/* webpackChunkName: 'item-list' */ '../base-list'),
  loading: SimpleLoading,
  delay: 300
});

const Manga = ({ location, filter, items, loadManga }) => (
  <BaseListView
    routeKey={location.key}
    type={Strings.manga}
    loadDataForTypedList={loadManga}
    items={items}
    statusFilter={filter}
  />
);

Manga.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  filter: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  items: mapStateToEntityList(state.entities.manga),
  filter: mapUrlFilterToEntityObject(ownProps.match.params)
});

const mapDispatchToProps = {
  loadManga
};

export default connect(mapStateToProps, mapDispatchToProps)(Manga);
