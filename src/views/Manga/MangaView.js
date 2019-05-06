import { connect } from 'react-redux';

import { lazyLoader } from 'components/LazyLoaders';
import { loadMangaById, deleteManga } from 'actions/manga';
import {
  loadChaptersBySeries,
  editChapter,
  deleteChapter
} from 'actions/chapter';
import { nextPage } from 'actions/paging';
import { Strings } from 'constants/values';
import {
  mapStateToEntity,
  mapStateToEntityList,
  getHistoryNameForItemType
} from 'utils/data';

const BaseView = lazyLoader(() =>
  import(/* webpackChunkName: 'ItemView' */ '../BaseView')
);

const mapStateToProps = (state, ownProps) => ({
  type: Strings.manga,
  isFetching: state.isFetching,
  itemId: Number(ownProps.match.params.id),
  item: mapStateToEntity(state.entities.manga, ownProps.match.params.id),
  historyItems: mapStateToEntityList(state.entities.chapter).filter(
    (x) => x.series && x.series.id === Number(ownProps.match.params.id)
  ),
  ...state.paging[getHistoryNameForItemType(Strings.manga)]
});

const mapDispatchToProps = {
  loadItemById: loadMangaById,
  loadHistoryForSeries: loadChaptersBySeries,
  editAction: editChapter,
  deleteAction: deleteChapter,
  deleteSeries: deleteManga,
  onLoadMoreHistory: nextPage
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseView);
