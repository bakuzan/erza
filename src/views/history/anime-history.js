import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';

import Loaders from '../../components/loaders/index';
import { Strings } from '../../constants/values';
import { mapStateToEntityList } from '../../utils/data';
import { loadEpisodesByDateRange } from '../../actions/episode';

const BaseHistoryView = Loadable({
  loader: () => import(/* webpackChunkName: 'history' */ './base-history'),
  loading: Loaders.Loadables.SimpleLoading,
  delay: 300
});

const AnimeHistoryView = ({ items, loadHistory }) => (
  <BaseHistoryView
    type={Strings.anime}
    items={items}
    loadHistory={loadHistory}
  />
);

AnimeHistoryView.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  loadHistory: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  items: mapStateToEntityList(state.entities.episode)
});

const mapDispatchToProps = {
  loadHistory: loadEpisodesByDateRange
};

export default connect(mapStateToProps, mapDispatchToProps)(AnimeHistoryView);
