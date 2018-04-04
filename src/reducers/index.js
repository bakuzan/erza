import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import anime from './anime';
import dailyAnime from './daily-anime';
import manga from './manga';
import episode from './episode';
import chapter from './chapter';
import tags from './tags';
import { isFetching } from './loading';
import { isAdult } from './is-adult';
import { sorting } from './sorting';
import { paging } from './paging';
import { theme } from './theme';
import { sidebar } from './sidebar';
import requestIndicator from './request-indicator';
import alert from './alert';
import lastLocation from './last-location';

const entities = combineReducers({
  anime,
  dailyAnime,
  manga,
  episode,
  chapter,
  tags
});

const rootReducer = combineReducers({
  routing,
  entities,
  isFetching,
  isAdult,
  sorting,
  paging,
  theme,
  sidebar,
  requestIndicator,
  alert,
  lastLocation
});

export default rootReducer;
