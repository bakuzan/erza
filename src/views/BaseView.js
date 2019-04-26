import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Helmet } from 'react-helmet-async';

import { RatingControl, LoadingSpinner, List } from 'mko';
import {
  ButtonisedNavButton,
  ButtonisedNewTabLink,
  ButtonisedNavLink,
  Button
} from 'components/Buttonised';
import SeriesImageContainer from 'components/SeriesImageContainer';
import { lazyLoader } from 'components/LazyLoaders';
import MalLink from 'components/MalLink';
import LoadableContent from 'containers/LoadableContent';
import { capitalise, formatDateForDisplay } from 'utils';
import { getUniquePropertiesForItemType } from 'utils/data';
import { Paths } from 'constants/paths';
import { Strings, Enums, Icons } from 'constants/values';

const STATS_PATH = `${Paths.base}${Paths.statistics}${Strings.anime}`;

const loadData = (props) => props.loadItemById(props.itemId);
const loadHistory = (props) =>
  props.loadHistoryForSeries({ parent: props.itemId });

const PagedHistoryList = lazyLoader(() =>
  import(/* webpackChunkName: 'PagedHistoryList' */ '../containers/PagedHistoryList')
);

class BaseView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasHistory: false
    };

    this.fetchHistory = this.fetchHistory.bind(this);
    this.preloadHistoryList = this.preloadHistoryList.bind(this);
    this.handleHistoryEdit = this.handleHistoryEdit.bind(this);
    this.handleHistoryDelete = this.handleHistoryDelete.bind(this);
    this.setStatNavLink = this.setStatNavLink.bind(this);
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

  setStatNavLink(state) {
    return {
      pathname: STATS_PATH,
      state
    };
  }

  render() {
    const { type, item, history, historyItems } = this.props;
    const { current, total } = getUniquePropertiesForItemType(type);

    if (!item || !item.id) {
      return <LoadingSpinner size="fullscreen" />;
    }

    return (
      <section>
        <Helmet>
          <title>{`View ${capitalise(type)} - ${item.title}`}</title>
        </Helmet>
        <div className="flex flex--row flex--reverse">
          <div className="flex flex--column flex--all padding-10">
            <header className="flex flex--row center-contents">
              <h2 className="no-margin">{item.title}</h2>
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
              <div>{`${item[current]} / ${item[total] || '??'}`}</div>
              {type === Strings.manga && (
                <div>{`${item.volume} / ${item.series_volumes || '??'}`}</div>
              )}
              <RatingControl
                id="rating"
                name="rating"
                value={item.rating || 0}
              />
              <List columns={2}>
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
                {type === Strings.anime && item.season && item.season.inSeason && (
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
              </List>
              <div>
                {!this.state.hasHistory && (
                  <Button
                    btnStyle="primary"
                    onMouseOver={this.preloadHistoryList}
                    onClick={this.fetchHistory}
                  >
                    View history
                  </Button>
                )}
                {this.state.hasHistory && (
                  <LoadableContent spinnerSize="default">
                    <div>
                      <PagedHistoryList
                        type={type}
                        filters={{ parent: this.props.itemId }}
                        items={historyItems}
                        editAction={this.handleHistoryEdit}
                        deleteAction={this.handleHistoryDelete}
                      />
                    </div>
                  </LoadableContent>
                )}
              </div>
            </div>
          </div>
          <SeriesImageContainer
            isFull
            src={item.image}
            alt={`Cover for ${item.title}`}
          >
            <div className="start-center-contents">
              {item.malId && (
                <MalLink type={type} malId={item.malId} title={item.title} />
              )}
              {item.link && (
                <ButtonisedNewTabLink
                  href={item.link}
                  btnSize="small"
                  icon={Icons.link}
                  title="Open content link"
                  aria-label="Open content link"
                />
              )}
            </div>
            <h4>Series tags</h4>
            <List columns={1}>
              {!item.tagList && (
                <li>
                  <p>{Strings.noItemsAvailable}</p>
                </li>
              )}
              {!!item.tagList &&
                item.tagList.map((item) => (
                  <li key={item.id} className="tag-item">
                    <ButtonisedNavLink
                      to={`${Paths.base}${Paths.tagManagement}${item.id}`}
                    >
                      {item.name}
                    </ButtonisedNavLink>
                  </li>
                ))}
            </List>
          </SeriesImageContainer>
        </div>
      </section>
    );
  }
}

BaseView.propTypes = {
  type: PropTypes.string.isRequired,
  itemId: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  historyItems: PropTypes.arrayOf(PropTypes.object),
  loadItemById: PropTypes.func.isRequired,
  loadHistoryForSeries: PropTypes.func.isRequired,
  editAction: PropTypes.func.isRequired,
  deleteAction: PropTypes.func.isRequired
};

export default BaseView;
