import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';

import { SimpleLoading } from '../../components/loadable';
import { loadMangaById } from '../../actions/manga';
import {
  loadChapterForSeries,
  editChapter,
  deleteChapter
} from '../../actions/chapter';
import { mapStateToEntity, mapStateToEntityList } from '../../utils/data';
import { Strings } from '../../constants/values';

const BaseView = Loadable({
  loader: () => import(/* webpackChunkName: 'item-view' */ '../base-view'),
  loading: SimpleLoading,
  delay: 300
});

const MangaView = ({
  itemId,
  item,
  historyItems,
  loadMangaById,
  loadChapterForSeries,
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
    loadHistoryForSeries={loadChapterForSeries}
    editAction={editChapter}
    deleteAction={deleteChapter}
  />
);

MangaView.propTypes = {
  itemId: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  historyItems: PropTypes.arrayOf(PropTypes.object),
  loadMangaById: PropTypes.func.isRequired,
  loadChapterForSeries: PropTypes.func.isRequired,
  editChapter: PropTypes.func.isRequired,
  deleteChapter: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  itemId: ownProps.match.params.id,
  item: mapStateToEntity(state.entities.manga, ownProps.match.params.id),
  historyItems: mapStateToEntityList(state.entities.chapter)
});

const mapDispatchToProps = {
  loadMangaById,
  loadChapterForSeries,
  editChapter,
  deleteChapter
};

export default connect(mapStateToProps, mapDispatchToProps)(MangaView);
