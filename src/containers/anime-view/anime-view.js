import React, {Component, PropTypes} from 'react'
import {browserHistory, Link} from 'react-router'
import { connect } from 'react-redux'
import RatingControl from '../../components/rating-control/rating-control';
import LoadingSpinner from '../../components/loading-spinner/loading-spinner'
import {loadAnimeById} from '../../actions/anime'
import {getKeyByValue} from '../../utils/common'
import {Paths} from '../../constants/paths'
import {Strings, Enums, Icons} from '../../constants/values'

const loadData = props => {
  props.loadAnimeById(props.params.id);
}

class AnimeView extends Component {

  componentDidMount() {
    loadData(this.props);
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
  isFetching: PropTypes.bool.isRequired
}

const selectItemFromId = (anime, id) => {
  return anime.byId[id] || {};
}

const mapStateToProps = (state, ownProps) => ({
  item: selectItemFromId(state.entities.anime, ownProps.params.id),
  isFetching: state.isFetching
})

const mapDispatchToProps = ({
  loadAnimeById
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnimeView)
