import { connect } from 'react-redux';

import { lazyLoader } from 'components/LazyLoaders';
import { Strings } from '../../constants/values';
import { mapStateToEntityList } from '../../utils/data';
import { loadEpisodesByDateRange } from '../../actions/episode';

const BaseHistoryView = lazyLoader(() =>
  import(/* webpackChunkName: 'History' */ './BaseHistory')
);

const mapStateToProps = (state) => ({
  type: Strings.anime,
  items: mapStateToEntityList(state.entities.episode)
});

const mapDispatchToProps = {
  loadHistory: loadEpisodesByDateRange
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseHistoryView);
