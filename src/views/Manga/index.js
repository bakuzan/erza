import { connect } from 'react-redux';

import { lazyLoader } from 'components/LazyLoaders';
import { Strings } from '../../constants/values';
import {
  mapStateToEntityList,
  mapUrlFilterToEntityObject
} from '../../utils/data';
import { loadManga } from '../../actions/manga';

const BaseListView = lazyLoader(() =>
  import(/* webpackChunkName: 'ItemList' */ '../BaseList')
);

const mapStateToProps = (state, ownProps) => ({
  type: Strings.manga,
  routeKey: ownProps.location.key,
  items: mapStateToEntityList(state.entities.manga),
  statusFilter: mapUrlFilterToEntityObject(ownProps.match.params)
});

const mapDispatchToProps = {
  loadDataForTypedList: loadManga
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseListView);
