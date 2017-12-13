import React from 'react';
import { connect } from 'react-redux'
import classNames from 'classnames'

import Header from '../../components/header/header';
import Sidebar from '../sidebar/sidebar'
import RequestIndicator from '../request-indicator'
import Toaster from '../../components/toaster/toaster';
import Shortcuts from '../../components/shortcuts/shortcuts';

import './app.css';
import {Route, Switch, Redirect, withRouter} from 'react-router-dom';
import {ConnectedRouter} from 'react-router-redux';
import {Paths} from '../../constants/paths'
import {Strings} from '../../constants/values'
import Home from '../../views/home'

import Anime from '../../views/anime/anime'
import AnimeView from '../../views/anime/anime-view'
import AnimeCreate from '../../views/anime/anime-create'

import Manga from '../../views/manga/manga'
import MangaView from '../../views/manga/manga-view'
import MangaCreate from '../../views/manga/manga-create'

import AnimeHistoryView from '../../views/history/anime-history'
import MangaHistoryView from '../../views/history/manga-history'

import Statistics from '../../views/statistics'



const ErzaRoute = ({ url, component: PageComponent, ...routeProps }) => (
  <Route
    {...routeProps}
    exact
    path={`${Paths.base}${url}`}
    render={props => <PageComponent {...props} />}
  />
)

const AppContent = ({ sidebarState }) => {
  const appClasses = classNames("erza", {
    "sidebar-collapsed": sidebarState.isCollapsed,
    "sidebar-hidden": sidebarState.isHidden
  })

  return (
    <div className={appClasses}>
      <Header />
      <Sidebar />
      <RequestIndicator />
      <main>
        <Switch>
          <Redirect exact from="/" to={Paths.base} />
          <Route exact path={Paths.base} component={Home} />} />

          <ErzaRoute url={`${Paths.anime.list}:filter`} component={Anime} />
          <ErzaRoute url={`${Paths.anime.view}:id`} component={AnimeView} />
          <ErzaRoute url={`${Paths.anime.create}`} component={AnimeCreate} />
          <ErzaRoute url={`${Paths.anime.edit}:id`} component={AnimeCreate} />

          <ErzaRoute url={`${Paths.manga.list}:filter`} component={Manga} />
          <ErzaRoute url={`${Paths.manga.view}:id`} component={MangaView} />
          <ErzaRoute url={`${Paths.manga.create}`} component={MangaCreate} />
          <ErzaRoute url={`${Paths.manga.edit}:id`} component={MangaCreate} />

          <ErzaRoute url={`${Paths.history}${Strings.anime}`} component={AnimeHistoryView} />
          <ErzaRoute url={`${Paths.history}${Strings.manga}`} component={MangaHistoryView} />

          <ErzaRoute url={`${Paths.base}${Paths.statistics}:type`} component={Statistics} />

          <Route path="*" render={() => <div>Page not found</div>} />
        </Switch>
      </main>
      <Toaster />
      <Shortcuts />
    </div>
  )
}

const mapStateToProps = state => ({
  sidebarState: state.sidebar
})

const AppContentConnectedWithRouter = withRouter(
  connect(
    mapStateToProps
  )(AppContent)
)


const App = ({ history, sidebarState }) => (
  <ConnectedRouter history={history}>
    <AppContentConnectedWithRouter />
  </ConnectedRouter>
)


export default App
