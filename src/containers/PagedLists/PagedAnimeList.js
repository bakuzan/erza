import { connect } from 'react-redux';

import AnimeList from 'components/ListComponents/AnimeList';
import BasePagedList from './BasePagedList';
import { Strings } from 'constants/values';
import { addEpisodes, startAnime } from 'actions/anime';

const mapStateToProps = () => ({
  type: Strings.anime,
  list: AnimeList
});

const mapDispatchToProps = {
  addHistoryToItem: addEpisodes,
  startSeries: startAnime
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BasePagedList);
