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


const ErzaRoute = ({ component: PageComponent, ...routeProps }) => (
  <Route
    {...routeProps}
    component={PageComponent}
  />
)

const ErzaRoutes = ({ match }) => (
  <Switch>
    <ErzaRoute path={`${match.path}${Paths.anime.list}:filter`} component={Anime} />
    <ErzaRoute path={`${match.path}${Paths.anime.view}:id`} component={AnimeView} />
    <ErzaRoute path={`${match.path}${Paths.anime.create}`} component={AnimeCreate} />
    <ErzaRoute path={`${match.path}${Paths.anime.edit}:id`} component={AnimeCreate} />

    <ErzaRoute path={`${match.path}${Paths.manga.list}:filter`} component={Manga} />
    <ErzaRoute path={`${match.path}${Paths.manga.view}:id`} component={MangaView} />
    <ErzaRoute path={`${match.path}${Paths.manga.create}`} component={MangaCreate} />
    <ErzaRoute path={`${match.path}${Paths.manga.edit}:id`} component={MangaCreate} />

    <ErzaRoute path={`${match.path}${Paths.history}${Strings.anime}`} component={AnimeHistoryView} />
    <ErzaRoute path={`${match.path}${Paths.history}${Strings.manga}`} component={MangaHistoryView} />

    <ErzaRoute path={`${match.path}${Paths.statistics}:type`} component={Statistics} />

    <ErzaRoute path="*" render={() => <div>Erza Page not found</div>} />
  </Switch>
)

const Routes = ({ history }) => (
  <ConnectedRouter history={history}>
    <App>
      <Switch>
        <Redirect exact from="/" to={Paths.base} />
        <Route exact path={Paths.base} component={Home} />

        <Route path={Paths.base} component={ErzaRoutes} />

        <Route path="*" render={() => <div>Page not found</div>} />
      </Switch>
    </App>
  </ConnectedRouter>
)

export default Routes
