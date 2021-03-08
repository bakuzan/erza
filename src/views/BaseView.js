import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Helmet } from 'react-helmet-async';

import List from 'meiko/List';
import LoadingSpinner from 'meiko/LoadingSpinner';
import RatingControl from 'meiko/RatingControl';
import {
  ButtonisedNavButton,
  ButtonisedNavLink,
  Button,
  ButtonIcon
} from 'components/Buttonised';
import SeriesImageContainer from 'components/SeriesImageContainer';
import { lazyLoader } from 'components/LazyLoaders';
import ContentLink from 'components/ExternalLinks/ContentLink';
import MalLink from 'components/ExternalLinks/MalLink';
import LoadableContent from 'containers/LoadableContent';
import QuickAdd from 'containers/QuickAdd';

import { capitalise, formatDateForDisplay } from 'utils';
import {
  getUniquePropertiesForItemType,
  getHistoryNameForItemType
} from 'utils/data';
import Paths from 'constants/paths';
import { Strings, Enums, Icons } from 'constants/values';

import 'styles/nano/baseView';

const getStatsPath = (type) => `${Paths.base}${Paths.statistics}${type}`;

const loadData = (props) => props.loadItemById(props.itemId);

const loadHistory = (props) =>
  props.loadHistoryForSeries({ seriesId: props.itemId });

const PagedHistoryList = lazyLoader(() =>
  import(
    /* webpackChunkName: 'PagedHistoryList' */ '../containers/PagedHistoryList'
  )
);

const RepeatHistory = lazyLoader(() =>
  import(/* webpackChunkName: 'RepeatHistory' */ '../containers/RepeatHistory')
);

class BaseView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasHistory: false,
      showQuickAdd: false
    };

    this.fetchHistory = this.fetchHistory.bind(this);
    this.preloadHistoryList = this.preloadHistoryList.bind(this);
    this.handleHistoryEdit = this.handleHistoryEdit.bind(this);
    this.handleHistoryDelete = this.handleHistoryDelete.bind(this);
    this.handleSeriesDelete = this.handleSeriesDelete.bind(this);
    this.setStatNavLink = this.setStatNavLink.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  componentDidMount() {
    loadData(this.props);
  }

  fetchHistory() {
    loadHistory(this.props);
    this.setState({ hasHistory: true });
  }

  preloadHistoryList() {
    PagedHistoryList.preload();
  }

  handleHistoryEdit(item) {
    this.props.editAction(item);
  }

  handleHistoryDelete(historyId) {
    this.props.deleteAction(historyId);
  }

  handleSeriesDelete() {
    this.props.deleteSeries(this.props.itemId);
  }

  setStatNavLink(state) {
    return {
      pathname: getStatsPath(this.props.type),
      state
    };
  }

  handleLoadMore() {
    const {
      isFetching,
      type,
      pageInfo,
      itemId,
      onLoadMoreHistory
    } = this.props;

    if (!isFetching && pageInfo.hasMore) {
      const historyType = getHistoryNameForItemType(type);
      onLoadMoreHistory(historyType, { seriesId: itemId });
    }
  }

  handleEdit(values) {
    this.props.addHistoryToItem(values, true);
    this.setState({ showQuickAdd: false, hasHistory: false });
  }

  render() {
    const { type, item, history, historyItems } = this.props;
    const { current, total } = getUniquePropertiesForItemType(type);

    if (!item || !item.id) {
      return <LoadingSpinner size="fullscreen" />;
    }

    const isPlanned = item.status === Enums.status.Planned;
    const isComplete = item.status === Enums.status.Completed;
    const canQuickAdd = !((isComplete && !item.isRepeat) || isPlanned);
    const showViewHistoryButton = !this.state.hasHistory && !isPlanned;

    return (
      <section id="viewPage" className="series-view">
        <Helmet>
          <title>{`View ${item.title} ${capitalise(type)}`}</title>
        </Helmet>
        <div className="series-view__content">
          <div className="flex flex--column flex--all padding-10">
            <header className="series-view__header">
              <h2 className="series-view__title">{item.title}</h2>
              <div className="flex-spacer" />
              <div className="button-group">
                <Button onClick={history.goBack}>{Strings.back}</Button>
                <ButtonisedNavButton
                  to={`${Paths.base}${Paths[type].edit}${item.id}`}
                >
                  {Strings.edit}
                </ButtonisedNavButton>
              </div>
            </header>
            <div className="view-content">
              <SeriesImageContainer
                isFull
                src={item.image}
                alt={`Cover for ${item.title}`}
              >
                <div>
                  {item.malId && (
                    <MalLink
                      type={type}
                      malId={item.malId}
                      title={item.title}
                    />
                  )}
                  {item.link && (
                    <ContentLink link={item.link} title={item.title} inline />
                  )}
                </div>
              </SeriesImageContainer>
              <div className="view-content__inner">
                <ul className="series-view-grid">
                  <li className="label">{current}</li>
                  <li className="value">
                    <div>{`${item[current]} / ${item[total] || '??'}`}</div>
                    {canQuickAdd && (
                      <ButtonIcon
                        btnStyle="primary"
                        btnSize="small"
                        className="view-content__plus-button"
                        icon="+"
                        aria-label={`Add ${item.title} ${current}s`}
                        title={`Add ${item.title} ${current}s`}
                        onClick={() => this.setState({ showQuickAdd: true })}
                      />
                    )}
                  </li>
                  {type === Strings.manga && (
                    <React.Fragment>
                      <li className="label">volume</li>
                      <li className="value">
                        {`${item.volume} / ${item.series_volumes || '??'}`}
                      </li>
                    </React.Fragment>
                  )}
                  <li className="label">rating</li>
                  <li className="value">
                    <RatingControl
                      id="rating"
                      containerClassName="series-view__rating"
                      name="rating"
                      value={item.rating || 0}
                    />
                  </li>
                  <li className="label">{Strings.start}</li>
                  <li className="value">
                    {formatDateForDisplay(item.start) || Strings.notStarted}
                  </li>

                  <li className="label">{Strings.end}</li>
                  <li className="value">
                    {item.end ? (
                      <ButtonisedNavLink
                        className="erza-button-link--hover-override"
                        to={this.setStatNavLink({ date: item.end })}
                      >
                        {formatDateForDisplay(item.end)}
                      </ButtonisedNavLink>
                    ) : (
                      Strings.unfinished
                    )}
                  </li>

                  <li className="label">{Strings.isAdult}</li>
                  <li
                    className="value"
                    icon={item.isAdult ? Icons.tick : Icons.cross}
                  />

                  <li className="label">{Strings.isRepeat}</li>
                  <li
                    className="value"
                    icon={item.isRepeat ? Icons.tick : Icons.cross}
                  />

                  <li className="label">{Strings.owned}</li>
                  <li
                    className="value"
                    icon={item.owned ? Icons.tick : Icons.cross}
                  />

                  <li className="label">{Strings.status}</li>
                  <li className="value">{item.status}</li>
                  {item.status === Enums.status.Completed && (
                    <React.Fragment>
                      <li className="label">{Strings.timesCompleted}</li>
                      <li className="value">
                        {item.timesCompleted === 0 ? (
                          item.timesCompleted
                        ) : (
                          <ButtonisedNavLink
                            className="erza-button-link--hover-override"
                            to={this.setStatNavLink({ repeatTab: true })}
                          >
                            {item.timesCompleted}
                          </ButtonisedNavLink>
                        )}
                      </li>
                    </React.Fragment>
                  )}
                  {type === Strings.anime &&
                    item.season &&
                    item.season.inSeason && (
                      <React.Fragment>
                        <li className="label">{Strings.season}</li>
                        <li className="value">
                          <ButtonisedNavLink
                            className="erza-button-link--hover-override"
                            to={this.setStatNavLink({ season: item.season })}
                          >
                            {`${item.season.season} ${item.season.year}`}
                          </ButtonisedNavLink>
                        </li>
                      </React.Fragment>
                    )}
                </ul>
              </div>

              <div>
                {' '}
                <h4 className="series-view__tag-title">Series tags</h4>
                <List columns={1}>
                  {!item.tags && (
                    <li>
                      <p>{Strings.noItemsAvailable}</p>
                    </li>
                  )}
                  {!!item.tags &&
                    item.tags.map((item) => (
                      <li key={item.id} className="tag-item">
                        <ButtonisedNavLink
                          className="tag-item__link"
                          to={`${Paths.base}${Paths.tagManagement}${item.id}`}
                        >
                          {item.name}
                        </ButtonisedNavLink>
                      </li>
                    ))}
                </List>
              </div>
              <div>
                <RepeatHistory type={type} seriesId={item.id} />

                {showViewHistoryButton && (
                  <Button
                    btnStyle="primary"
                    onMouseOver={this.preloadHistoryList}
                    onClick={this.fetchHistory}
                  >
                    View {current} history
                  </Button>
                )}
                {this.state.hasHistory && (
                  <LoadableContent spinnerSize="default">
                    <div>
                      <PagedHistoryList
                        type={type}
                        filters={{ seriesId: this.props.itemId }}
                        items={historyItems}
                        editAction={this.handleHistoryEdit}
                        deleteAction={this.handleHistoryDelete}
                        onLoadMore={this.handleLoadMore}
                      />
                    </div>
                  </LoadableContent>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-spacer" />
        <footer className="series-view__footer">
          <div className="series-delete">
            <Button
              className="series-delete__button"
              onClick={this.handleSeriesDelete}
            >
              Delete
            </Button>
          </div>
        </footer>
        <QuickAdd
          isOpen={this.state.showQuickAdd}
          type={type}
          seriesId={item.id}
          onSubmit={this.handleEdit}
          onClose={() => this.setState({ showQuickAdd: false })}
        />
      </section>
    );
  }
}

BaseView.propTypes = {
  type: PropTypes.string.isRequired,
  itemId: PropTypes.number.isRequired,
  item: PropTypes.object.isRequired,
  historyItems: PropTypes.arrayOf(PropTypes.object),
  loadItemById: PropTypes.func.isRequired,
  loadHistoryForSeries: PropTypes.func.isRequired,
  editAction: PropTypes.func.isRequired,
  deleteAction: PropTypes.func.isRequired,
  onLoadMoreHistory: PropTypes.func.isRequired,
  addHistoryToItem: PropTypes.func.isRequired
};

export default BaseView;
