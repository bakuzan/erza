import { connect } from 'react-redux';

import MangaList from 'components/ListComponents/MangaList';
import BasePagedList from './BasePagedList';
import { Strings } from 'constants/values';
import { addChapters, startManga } from 'actions/manga';

const mapStateToProps = () => ({
  type: Strings.manga,
  list: MangaList
});

const mapDispatchToProps = {
  addHistoryToItem: addChapters,
  startSeries: startManga
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BasePagedList);
