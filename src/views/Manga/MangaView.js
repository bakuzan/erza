import { connect } from 'react-redux';

import { lazyLoader } from 'components/LazyLoaders';
import { loadMangaById, deleteManga } from '../../actions/manga';
import {
  loadChaptersBySeries,
  editChapter,
  deleteChapter
} from '../../actions/chapter';
import { mapStateToEntity, mapStateToEntityList } from '../../utils/data';
import { Strings } from '../../constants/values';

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
  )
});

const mapDispatchToProps = {
  loadItemById: loadMangaById,
  loadHistoryForSeries: loadChaptersBySeries,
  editAction: editChapter,
  deleteAction: deleteChapter,
  deleteSeries: deleteManga
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseView);
