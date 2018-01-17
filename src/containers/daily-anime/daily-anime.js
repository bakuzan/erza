import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchDailyAnime } from '../../actions/daily-anime';
import { Icons } from '../../constants/values';
import { padNumber } from '../../utils/common';
import { mapStateToEntityList } from '../../utils/data';
import { getDayName } from '../../utils/date';

import './daily-anime.css';

const dummyEvent = value => ({
  target: { name: 'search', type: 'text', value }
});

function createOffsetText(dateOffset, date) {
  switch (dateOffset) {
    case 7:
      return 'Watch Today';
    case 6:
      return 'Watch Tomorrow';
    default:
      const day = getDayName(date);
      return `Watch on ${day}`;
  }
}

class DailyAnime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateOffset: 7
    };

    this.handleDayChange = this.handleDayChange.bind(this);
  }

  componentDidMount() {
    this.props.fetchDailyAnime(this.state.dateOffset);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.routeKey !== this.props.routeKey) {
      nextProps.fetchDailyAnime(this.state.dateOffset);
    }
  }

  handleDayChange(change) {
    this.setState(prev => ({
      dateOffset: prev.dateOffset + change
    }));
  }

  render() {
    const { items, onSelect } = this.props;

    const date = new Date();
    date.setDate(date.getDate() - this.state.dateOffset);

    const hasDailyAnime = !!items.length;
    const displayText = createOffsetText(this.state.dateOffset, date);

    return (
      <section className="daily-anime-container">
        <header className="daily-anime-header">
          <button
            type="button"
            className="button button-icon primary"
            icon={Icons.left}
            disabled={this.state.dateOffset > 6}
            onClick={() => this.handleDayChange(1)}
          />
          <div>{displayText}</div>
          <button
            type="button"
            className="button button-icon primary"
            icon={Icons.right}
            disabled={this.state.dateOffset === 1}
            onClick={() => this.handleDayChange(-1)}
          />
        </header>
        <ul className="list column one">
          {hasDailyAnime &&
            items.map(item => (
              <li key={item._id}>
                <button
                  type="button"
                  className="button"
                  onClick={() => onSelect(dummyEvent(item.series.title))}
                >
                  {`${item.series.title} #${padNumber(item.episode + 1, 3)}`}
                </button>
              </li>
            ))}
          {!hasDailyAnime && (
            <li>
              <div>No daily anime found.</div>
            </li>
          )}
        </ul>
      </section>
    );
  }
}

DailyAnime.propTypes = {
  routeKey: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  items: mapStateToEntityList(state.entities.dailyAnime)
});

const mapDispatchToState = {
  fetchDailyAnime
};

export default connect(mapStateToProps, mapDispatchToState)(DailyAnime);
