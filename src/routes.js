import React from 'react'
import {Route, Switch, Redirect} from 'react-router-dom';
import {ConnectedRouter} from 'react-router-redux';
import {Paths} from './constants/paths'
import {Strings} from './constants/values'
import App from './containers/app/app'
import Home from './views/home'

import Anime from './views/anime/anime'
import AnimeView from './views/anime/anime-view'
import AnimeCreate from './views/anime/anime-create'

import Manga from './views/manga/manga'
import MangaView from './views/manga/manga-view'
import MangaCreate from './views/manga/manga-create'

import AnimeHistoryView from './views/history/anime-history'
import MangaHistoryView from './views/history/manga-history'

import Statistics from './views/statistics'


const ErzaRoutes = ({ match }) => {
  console.log("erza routes > ", match)
  return (
    <Switch>
      <Route path={`${match.path}${Paths.anime.list}:filter`} component={Anime} />
      <Route path={`${match.path}${Paths.anime.view}:id`} component={AnimeView} />
      <Route path={`${match.path}${Paths.anime.create}`} component={AnimeCreate} />
      <Route path={`${match.path}${Paths.anime.edit}:id`} component={AnimeCreate} />

      <Route path={`${match.path}${Paths.manga.list}:filter`} component={Manga} />
      <Route path={`${match.path}${Paths.manga.view}:id`} component={MangaView} />
      <Route path={`${match.path}${Paths.manga.create}`} component={MangaCreate} />
      <Route path={`${match.path}${Paths.manga.edit}:id`} component={MangaCreate} />

      <Route path={`${match.path}${Paths.history}${Strings.anime}`} component={AnimeHistoryView} />
      <Route path={`${match.path}${Paths.history}${Strings.manga}`} component={MangaHistoryView} />

      <Route path={`${match.path}${Paths.statistics}:type`} component={Statistics} />

      <Route path="*" render={() => <div>Erza Page not found</div>} />
    </Switch>
  )
}

const Routes = ({ history }) => (
  <ConnectedRouter history={history}>
    <App>
      <Switch>
        <Redirect exact from="/" to={Paths.base} />

        <Route exact path={Paths.base} component={Home} />
        <Route path={`${Paths.base}`} component={ErzaRoutes} />

        <Route path="*" render={() => <div>Page not found</div>} />
      </Switch>
    </App>
  </ConnectedRouter>
)

export default Routes
