import React from 'react'
import {Router, Route, IndexRoute, Redirect} from 'react-router';
import {Paths} from './constants/paths'
import {Strings} from './constants/values'
import App from './containers/app/app'
import Home from './containers/home/home'

import Anime from './views/anime/anime'
import AnimeView from './views/anime/anime-view'
import AnimeCreate from './containers/anime-create/anime-create'

import Manga from './views/manga/manga'
import MangaView from './views/manga/manga-view'

import AnimeHistoryView from './views/history/anime-history'
import MangaHistoryView from './views/history/manga-history'

const Routes = ({ history }) => (
  <Router history={history}>
    <Redirect from="/" to={Paths.base} />
    <Route path={Paths.base} component={App}>
      <IndexRoute component={Home} />

      <Route path={`${Paths.anime.list}(:filter)`} component={Anime} />
      <Route path={`${Paths.anime.view}(:id)`} component={AnimeView} />
      <Route path={Paths.anime.create} component={AnimeCreate} />
      <Route path={`${Paths.anime.edit}(:id)`} component={AnimeCreate} />

      <Route path={`${Paths.manga.list}(:filter)`} component={Manga} />
      <Route path={`${Paths.manga.view}(:id)`} component={MangaView} />

      <Route path={`${Paths.history}${Strings.anime}`} component={AnimeHistoryView} />
      <Route path={`${Paths.history}${Strings.manga}`} component={MangaHistoryView} />
    </Route>
  </Router>
)

export default Routes
