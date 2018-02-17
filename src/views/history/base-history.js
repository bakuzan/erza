import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoadingSpinner from '../../components/loading-spinner/loading-spinner';
import PagedHistoryList from '../../containers/paged-history-list/paged-history-list';
import { getEventValue, getTimeoutSeconds, debounce } from '../../utils/common';
import {
  startOfDay,
  endOfDay,
  dateAsMs,
  formatDateForInput
} from '../../utils/date';

const dateRangeForQuery = (from = new Date(), to = new Date()) => [
  dateAsMs(startOfDay(from)),
  dateAsMs(endOfDay(to))
];
const loadData = (props, state) =>
  props.loadHistory({ dateRange: dateRangeForQuery(state.from, state.to) });

const Datepicker = ({ label, ...props }) => (
  <div className="has-float-label input-container">
    <input type="date" placeholder=" " {...props} />
    <label>{label}</label>
  </div>
);

class BaseHistoryView extends Component {
  constructor(props) {
    super(props);
    const dr = dateRangeForQuery();
    this.state = {
      from: formatDateForInput(dr[0]),
      to: formatDateForInput(dr[1])
    };

    this.handleUserInput = this.handleUserInput.bind(this);
  }

  componentDidMount() {
    loadData(this.props, this.state);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.isAdult !== this.props.isAdult ||
      nextProps.type !== this.props.type ||
      nextProps.itemsPerPage !== this.props.itemsPerPage
    ) {
      loadData(nextProps, this.state);
    }
  }

  handleUserInput({ target }) {
    const newValue = getEventValue(target);
    this.setState({ [target.name]: newValue });
    debounce(() => loadData(this.props, this.state), getTimeoutSeconds(1));
  }

  render() {
    const { isFetching, items, type } = this.props;
    const filters = {
      dateRange: dateRangeForQuery(this.state.from, this.state.to)
    };

    return (
      <div className="flex-row">
        {isFetching && <LoadingSpinner size="fullscreen" />}
        <div className="filters-container">
          <div>
            <Datepicker
              name="from"
              label="from"
              value={this.state.from}
              onChange={this.handleUserInput}
            />
            <Datepicker
              name="to"
              label="to"
              value={this.state.to}
              min={this.state.from}
              onChange={this.handleUserInput}
            />
          </div>
        </div>
        {!isFetching && (
          <PagedHistoryList type={type} filters={filters} items={items} />
        )}
      </div>
    );
  }
}

BaseHistoryView.propTypes = {
  type: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isAdult: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(PropTypes.object),
  loadHistory: PropTypes.func.isRequired,
  itemsPerPage: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  isFetching: state.isFetching,
  isAdult: state.isAdult,
  itemsPerPage: state.paging.itemsPerPage
});

export default connect(mapStateToProps)(BaseHistoryView);
