import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import anime from './anime';
import dailyAnime from './dailyAnime';
import manga from './manga';
import episode from './episode';
import chapter from './chapter';
import tags from './tags';
import { isFetching } from './loading';
import { isAdult } from './isAdult';
import { sorting } from './sorting';
import { paging } from './paging';
import { theme } from './theme';
import { sidebar } from './sidebar';
import requestIndicator from './requestIndicator';
import alert from './alert';
import lastLocation from './lastLocation';
import filters from './filters';
import repeatHistory from './repeatHistory';

const entities = combineReducers({
  anime,
  dailyAnime,
  manga,
  episode,
  chapter,
  tags,
  repeatHistory
});

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    entities,
    isFetching,
    isAdult,
    sorting,
    paging,
    theme,
    sidebar,
    requestIndicator,
    alert,
    lastLocation,
    filters
  });

export default createRootReducer;
