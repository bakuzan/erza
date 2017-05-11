import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import LoadingSpinner from '../../components/loading-spinner/loading-spinner'
import {mapStateToEntityList} from '../../utils/data'
import { loadEpisodesByDateRange } from '../../actions/episode'

const loadData = (props, state) => props.loadEpisodes({ ...state });

class HistoryView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      search: ''
    };

    this.handleUserInput = this.handleUserInput.bind(this);
  }

  componentDidMount() {
    loadData(this.props, this.state);
  }

  componentWillReceiveProps(nextProps) {
    console.log('%c will get props !! > ', 'font-size: 18px; font-weight: bold; color: indigo', nextProps, this.props);
    if (
      nextProps.isAdult !== this.props.isAdult ||
      nextProps.params.type !== this.props.params.type ||
      nextProps.location.key !== this.props.location.key
    ) {
      loadData(nextProps, this.state)
    }
  }

  render() {
    const { isFetching, items } = this.props;

    return (
      <div className="flex-row">
      {
        isFetching &&
        <LoadingSpinner size="fullscreen" />
      }
      {
        !isFetching &&
        <div>NEED A PAGED EPISODE LIST HERE</div>
      }
      </div>
    );
  }

}

HistoryView.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  isAdult: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(PropTypes.object),
  loadEpisodes: PropTypes.func.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  isFetching: state.isFetching,
  isAdult: state.isAdult,
  items: mapStateToEntityList(state.entities.episode)
})

const mapDispatchToProps = {
  loadEpisodes: loadEpisodesByDateRange
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HistoryView)
