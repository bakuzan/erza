import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';

import { Loaders } from 'meiko';
import { Strings } from '../../constants/values';
import { mapStateToEntityList } from '../../utils/data';
import { loadChaptersByDateRange } from '../../actions/chapter';

const BaseHistoryView = Loadable({
  loader: () => import(/* webpackChunkName: 'history' */ './base-history'),
  loading: Loaders.Loadables.SimpleLoading,
  delay: 300
});

const MangaHistoryView = ({ items, loadHistory }) => (
  <BaseHistoryView
    type={Strings.manga}
    items={items}
    loadHistory={loadHistory}
  />
);

MangaHistoryView.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  loadHistory: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  items: mapStateToEntityList(state.entities.chapter)
});

const mapDispatchToProps = {
  loadHistory: loadChaptersByDateRange
};

export default connect(mapStateToProps, mapDispatchToProps)(MangaHistoryView);
