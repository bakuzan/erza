import { connect } from 'react-redux';

import MangaList from 'components/ListComponents/MangaList';
import BasePagedList from './BasePagedList';
import { Strings } from 'constants/values';
import { addChapters } from 'actions/manga';

const mapStateToProps = (state) => ({
  type: Strings.manga,
  list: MangaList
});

const mapDispatchToProps = {
  addHistoryToItem: addChapters
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BasePagedList);
