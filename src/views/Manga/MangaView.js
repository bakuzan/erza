import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { lazyLoader } from 'components/LazyLoaders';
import { loadMangaById } from '../../actions/manga';
import {
  loadChaptersByDateRange,
  editChapter,
  deleteChapter
} from '../../actions/chapter';
import { mapStateToEntity, mapStateToEntityList } from '../../utils/data';
import { Strings } from '../../constants/values';

const BaseView = lazyLoader(() =>
  import(/* webpackChunkName: 'ItemView' */ '../BaseView')
);

const MangaView = ({
  itemId,
  item,
  historyItems,
  loadMangaById,
  loadChaptersByDateRange,
  deleteChapter,
  editChapter,
  ...props
}) => (
  <BaseView
    {...props}
    type={Strings.manga}
    itemId={itemId}
    item={item}
    historyItems={historyItems}
    loadItemById={loadMangaById}
    loadHistoryForSeries={loadChaptersByDateRange}
    editAction={editChapter}
    deleteAction={deleteChapter}
  />
);

MangaView.propTypes = {
  itemId: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  historyItems: PropTypes.arrayOf(PropTypes.object),
  loadMangaById: PropTypes.func.isRequired,
  loadChaptersByDateRange: PropTypes.func.isRequired,
  editChapter: PropTypes.func.isRequired,
  deleteChapter: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  isFetching: state.isFetching,
  itemId: ownProps.match.params.id,
  item: mapStateToEntity(state.entities.manga, ownProps.match.params.id),
  historyItems: mapStateToEntityList(state.entities.chapter)
});

const mapDispatchToProps = {
  loadMangaById,
  loadChaptersByDateRange,
  editChapter,
  deleteChapter
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MangaView);
