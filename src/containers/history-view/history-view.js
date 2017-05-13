import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import LoadingSpinner from '../../components/loading-spinner/loading-spinner'
import InputSearch from '../../components/input-search/input-search'
import PagedHistoryList from '../../containers/paged-history-list/paged-history-list'
import {mapStateToEntityList} from '../../utils/data'
import {getEventValue, getTimeoutSeconds, debounce, dateAsMs, formatDateForInput} from '../../utils/common'
import { loadEpisodesByDateRange } from '../../actions/episode'

//   search: state.search,
const loadData = (props, state) => props.loadEpisodes({
  dateRange: [dateAsMs(state.from), dateAsMs(state.to)]
});

const dateRange = () => {
  const d = new Date();
  return [
    new Date(d.getFullYear(), d.getMonth(), d.getDate()),
    new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)
  ]
}

class HistoryView extends Component {

  constructor(props) {
    super(props);
    const dr = dateRange();
    this.state = {
      search: '',
      from: formatDateForInput(dr[0]),
      to: formatDateForInput(dr[1])
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

  handleUserInput({ target }) {
    const newValue = getEventValue(target);
    this.setState({ [target.name]: newValue });
    debounce(() => loadData(this.props, this.state), getTimeoutSeconds(1));
  }

  render() {
    const { isFetching, items } = this.props;

    return (
      <div className="flex-row">
      {
        isFetching &&
        <LoadingSpinner size="fullscreen" />
      }
      <div>
        <InputSearch
          search={this.state.search}
          onChange={this.handleUserInput}
        />
        <div>
          <div className="has-float-label input-container">
            <input type="date"
              name="from"
              placeholder=" "
              value={this.state.from}
              onChange={this.handleUserInput}
              />
            <label>from</label>
          </div>
        </div>
      </div>
      {
        !isFetching &&
        <PagedHistoryList
            filters={{
              search: this.state.search,
              dateRange: [dateAsMs(this.state.from), dateAsMs(this.state.to)]
            }}
            items={items}
         />
      }
      </div>
    );
  }

}

HistoryView.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(PropTypes.object),
  loadEpisodes: PropTypes.func.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  isFetching: state.isFetching,
  items: mapStateToEntityList(state.entities.episode)
})

const mapDispatchToProps = {
  loadEpisodes: loadEpisodesByDateRange
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HistoryView)
