import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

import Paths from './constants/paths';
import { routeLazyLoader } from 'components/LazyLoaders';
import App from './containers/App';
import Anime from './views/Anime';
import AnimeView from './views/Anime/AnimeView';
import AnimeCreate from './views/Anime/AnimeCreate';
import Manga from './views/Manga';
import MangaView from './views/Manga/MangaView';
import MangaCreate from './views/Manga/MangaCreate';

const History = routeLazyLoader(() =>
  import(/* webpackChunkName: 'History' */ './views/History')
);
const Home = routeLazyLoader(() =>
  import(/* webpackChunkName: 'Home' */ './views/Home')
);
const Statistics = routeLazyLoader(() =>
  import(/* webpackChunkName: 'Statistics' */ './views/Statistics')
);
const TagManagement = routeLazyLoader(() =>
  import(/* webpackChunkName: 'TagManagement' */ './views/TagManagement')
);
const Timeline = routeLazyLoader(() =>
  import(/* webpackChunkName: 'Timeline' */ './views/Timeline')
);

const ErzaRoute = ({ component: PageComponent, ...routeProps }) => (
  <Route {...routeProps} component={PageComponent} />
);

const ErzaRoutes = ({ match }) => (
  <Switch>
    <ErzaRoute
      path={`${match.path}${Paths.anime.list}:filter`}
      component={Anime}
    />
    <ErzaRoute
      path={`${match.path}${Paths.anime.view}:id`}
      component={AnimeView}
    />
    <ErzaRoute
      path={`${match.path}${Paths.anime.create}`}
      component={AnimeCreate}
    />
    <ErzaRoute
      path={`${match.path}${Paths.anime.edit}:id`}
      component={AnimeCreate}
    />

    <ErzaRoute
      path={`${match.path}${Paths.manga.list}:filter`}
      component={Manga}
    />
    <ErzaRoute
      path={`${match.path}${Paths.manga.view}:id`}
      component={MangaView}
    />
    <ErzaRoute
      path={`${match.path}${Paths.manga.create}`}
      component={MangaCreate}
    />
    <ErzaRoute
      path={`${match.path}${Paths.manga.edit}:id`}
      component={MangaCreate}
    />

    <ErzaRoute
      path={`${match.path}${Paths.history}:type`}
      component={History}
    />
    <ErzaRoute
      path={`${match.path}${Paths.statistics}:type`}
      component={Statistics}
    />

    <ErzaRoute
      path={`${match.path}${Paths.tagManagement}`}
      component={TagManagement}
    />

    <ErzaRoute
      path={`${match.path}${Paths.timeline}:type?`}
      component={Timeline}
    />

    <ErzaRoute path="*" render={() => <div>Erza Page not found</div>} />
  </Switch>
);

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
);

export default Routes;
