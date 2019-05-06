import { connect } from 'react-redux';

import AnimeList from 'components/ListComponents/AnimeList';
import BasePagedList from './BasePagedList';
import { Strings } from 'constants/values';
import { addEpisodes } from 'actions/anime';

const mapStateToProps = (state) => ({
  type: Strings.anime,
  list: AnimeList
});

const mapDispatchToProps = {
  addHistoryToItem: addEpisodes
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BasePagedList);
