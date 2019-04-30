import { connect } from 'react-redux';

import { lazyLoader } from 'components/LazyLoaders';
import { Strings } from '../../constants/values';
import { mapStateToEntityList } from '../../utils/data';
import { loadChaptersByDateRange } from '../../actions/chapter';

const BaseHistoryView = lazyLoader(() =>
  import(/* webpackChunkName: 'History' */ './BaseHistory')
);

const mapStateToProps = (state) => ({
  type: Strings.manga,
  items: mapStateToEntityList(state.entities.chapter)
});

const mapDispatchToProps = {
  loadHistory: loadChaptersByDateRange
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseHistoryView);
