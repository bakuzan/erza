import React from 'react'
import {Router, Route, IndexRoute, Redirect} from 'react-router';
import {Paths} from './constants/paths'
import App from './containers/app/app'
import Home from './containers/home/home'
import Anime from './containers/anime/anime'
import AnimeView from './containers/anime-view/anime-view'
import AnimeCreate from './containers/anime-create/anime-create'

const Routes = ({ history }) => (
  <Router history={history}>
    <Redirect from="/" to={Paths.base} />
    <Route path={Paths.base} component={App}>
      <IndexRoute component={Home} />

      <Route path={`${Paths.anime.list}(:filter)`} component={Anime} />
      <Route path={`${Paths.anime.view}(:id)`} component={AnimeView} />
      <Route path={Paths.anime.create} component={AnimeCreate} />
      <Route path={`${Paths.anime.edit}(:id)`} component={AnimeCreate} />
    </Route>
  </Router>
)

export default Routes
