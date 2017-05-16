import React, {Component, PropTypes} from 'react'
import {browserHistory, Link} from 'react-router'
import { connect } from 'react-redux'
import RatingControl from '../../components/rating-control/rating-control'
import LoadingSpinner from '../../components/loading-spinner/loading-spinner'
import HistoryList from '../../components/history-list/history-list'
import {loadAnimeById} from '../../actions/anime'
import {loadEpisodeForSeries} from '../../actions/episode'
import {getKeyByValue} from '../../utils/common'
import {Paths} from '../../constants/paths'
import {Strings, Enums, Icons} from '../../constants/values'

const loadData = props => props.loadAnimeById(props.params.id);
const loadHistory = props => props.loadEpisodeForSeries(props.params.id);

class AnimeView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hasHistory: false
    }
  }

  componentDidMount() {
    loadData(this.props);
  }

  fetchHistory() {
    loadHistory(this.props);
    this.setState({ hasHistory: true });
  }

  render() {
    const { item, isFetching } = this.props;
    if (isFetching) return (<LoadingSpinner size="fullscreen" />);

    return (
      <section>
        <div className="flex-row reverse">
          <div className="flex-all padding-10">
            <header className="flex-row center-contents">
              <h2 className="no-margin">{ item.title }</h2>
              <div className="flex-spacer"></div>
              <div className="button-group">
                <button type="button"
                        onClick={browserHistory.goBack}
                        className="button ripple">
                  { Strings.back }
                </button>
                <Link to={`${Paths.base}${Paths.anime.edit}${item._id}`}
                      className="button ripple">
                  { Strings.edit }
                </Link>
              </div>
            </header>
            <div className="view-content">

              <span>{ `${item.episode} / ${item.series_episodes}` }</span>
              <RatingControl name="rating"
                value={item.rating || 0}
                />
              <ul className="list column two">
                <li className="label">{Strings.isAdult}</li>
                <li className="value" icon={item.isAdult ? Icons.tick : Icons.cross}></li>

                <li className="label">{Strings.isRepeat}</li>
                <li className="value" icon={item.isRepeat ? Icons.tick : Icons.cross}></li>

                <li className="label">{Strings.owned}</li>
                <li className="value" icon={item.owned ? Icons.tick : Icons.cross}></li>

                <li className="label">{Strings.status}</li>
                <li className="value">{getKeyByValue(Enums.anime.status, item.status)}</li>
              </ul>
              <div>
              {
                !this.state.hasHistory &&
                <button
                  type="button"
                  className="button primary ripple"
                  onClick={() => this.fetchHistory()}
                >
                  View history
                </button>
              }
              {
                this.state.hasHistory &&
                <div>
                {
                  !this.props.history.length &&
                  <p>No history found.</p>
                }
                {
                  !!this.props.history.length &&
                  <HistoryList
                    items={this.props.history}
                  />
                }
                </div>
              }
              </div>
            </div>
          </div>
          <div className="series-image-container">
            <img src={item.image} alt={`Cover for ${item.title}`} />
          </div>
        </div>
      </section>
    );
  }
}

AnimeView.propTypes = {
  item: PropTypes.object.isRequired,
  history: PropTypes.arrayOf(PropTypes.object),
  isFetching: PropTypes.bool.isRequired,
  loadAnimeById: PropTypes.func.isRequired,
  loadEpisodeForSeries: PropTypes.func.isRequired
}

const selectItemFromId = (anime, id) => anime.byId[id] || {};
const selectHistoryByParent = episode => episode.allIds.map(_id => episode.byId[_id]);

const mapStateToProps = (state, ownProps) => ({
  item: selectItemFromId(state.entities.anime, ownProps.params.id),
  history: selectHistoryByParent(state.entities.episode),
  isFetching: state.isFetching
})

const mapDispatchToProps = ({
  loadAnimeById,
  loadEpisodeForSeries
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnimeView)
