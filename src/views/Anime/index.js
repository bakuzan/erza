import { connect } from 'react-redux';
import Loadable from 'react-loadable';

import { SimpleLoading } from 'meiko/Loadable';
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

const mapStateToProps = (state, ownProps) => ({
  type: Strings.anime,
  routeKey: ownProps.location.key,
  items: mapStateToEntityList(state.entities.anime),
  statusFilter: mapUrlFilterToEntityObject(ownProps.match.params)
});

const mapDispatchToProps = {
  loadDataForTypedList: loadAnime
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseListView);
