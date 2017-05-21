import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import LoadingSpinner from '../../components/loading-spinner/loading-spinner'
import ClearableInput from '../../components/clearable-input/clearable-input'
import PagedHistoryList from '../../containers/paged-history-list/paged-history-list'
import {mapStateToEntityList} from '../../utils/data'
import {getEventValue, getTimeoutSeconds, debounce} from '../../utils/common'
import {startOfDay, endOfDay, dateAsMs, formatDateForInput} from '../../utils/date'
import { loadEpisodesByDateRange } from '../../actions/episode'

const dateRangeForQuery = (from = new Date(), to = new Date()) => [dateAsMs(startOfDay(from)), dateAsMs(endOfDay(to))]

//   search: state.search,
const loadData = (props, state) => props.loadEpisodes({
  dateRange: dateRangeForQuery(state.from, state.to)
});

class HistoryView extends Component {

  constructor(props) {
    super(props);
    const dr = dateRangeForQuery();
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
    const filters = { dateRange: dateRangeForQuery(this.state.from, this.state.to) };

    return (
      <div className="flex-row">
      {
        isFetching &&
        <LoadingSpinner size="fullscreen" />
      }
      <div className="list-filter">
        <ClearableInput
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
          <div className="has-float-label input-container">
            <input type="date"
              name="to"
              placeholder=" "
              value={this.state.to}
              onChange={this.handleUserInput}
              />
            <label>to</label>
          </div>
        </div>
      </div>
      {
        !isFetching &&
        <PagedHistoryList
            filters={filters}
            items={items}
         />
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
