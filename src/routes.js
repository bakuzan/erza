import React from 'react'
import {Route, Switch} from 'react-router-dom';
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


const ErzaRoute = ({ path, component: Component, ...passThrough }) => {
  console.log("ERZA ROUTE > ", `${Paths.base}${path}`)
  return <Route path={`${Paths.base}${path}`} render={props => <Component {...props} />} {...passThrough} />
}

const Routes = ({ history }) => (
  <ConnectedRouter history={history}>
    <App>
      <Switch>
        <Route exact path={Paths.base} render={props => <Home {...props} />} />

        <ErzaRoute path={`${Paths.anime.list}(:filter)`} component={Anime} />
        <ErzaRoute path={`${Paths.anime.view}(:id)`} component={AnimeView} />
        <ErzaRoute path={`${Paths.anime.create}`} component={AnimeCreate} />
        <ErzaRoute path={`${Paths.anime.edit}(:id)`} component={AnimeCreate} />

        <ErzaRoute path={`${Paths.manga.list}(:filter)`} component={Manga} />
        <ErzaRoute path={`${Paths.manga.view}(:id)`} component={MangaView} />
        <ErzaRoute path={`${Paths.manga.create}`} component={MangaCreate} />
        <ErzaRoute path={`${Paths.manga.edit}(:id)`} component={MangaCreate} />

        <ErzaRoute path={`${Paths.history}${Strings.anime}`} component={AnimeHistoryView} />
        <ErzaRoute path={`${Paths.history}${Strings.manga}`} component={MangaHistoryView} />

        <ErzaRoute path={`${Paths.statistics}(:type)`} component={Statistics} />
      </Switch>
    </App>
  </ConnectedRouter>
)

export default Routes
