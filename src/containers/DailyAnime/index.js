import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { List } from 'mko';
import { ButtonIcon, Button } from 'components/Buttonised';
import { fetchDailyAnime } from 'actions/dailyAnime';
import { Icons } from 'constants/values';
import { padNumber, getDayName } from 'utils';
import { mapStateToEntityList } from 'utils/data';

import './DailyAnime.scss';

const dummyEvent = (value) => ({
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

  componentDidUpdate(prevProps) {
    if (prevProps.routeKey !== this.props.routeKey) {
      this.props.fetchDailyAnime(this.state.dateOffset);
    }
  }

  handleDayChange(change) {
    this.setState((prev) => {
      const dateOffset = prev.dateOffset + change;
      this.props.fetchDailyAnime(dateOffset);
      return { dateOffset };
    });
  }

  render() {
    const { items, onSelect } = this.props;

    const date = new Date();
    date.setDate(date.getDate() - this.state.dateOffset);

    const hasDailyAnime = !!items.length;
    const displayText = createOffsetText(this.state.dateOffset, date);

    return (
      <section className="daily-animeContainer">
        <header className="daily-anime-header">
          <ButtonIcon
            btnStyle="primary"
            icon={Icons.left}
            aria-label="Previous Daily Anime"
            disabled={this.state.dateOffset > 6}
            onClick={() => this.handleDayChange(1)}
          />
          <div>{displayText}</div>
          <ButtonIcon
            btnStyle="primary"
            icon={Icons.right}
            aria-label="Next Daily Anime"
            disabled={this.state.dateOffset === 1}
            onClick={() => this.handleDayChange(-1)}
          />
        </header>
        <List columns={1}>
          {hasDailyAnime &&
            items.map((item) => (
              <li key={item._id}>
                <Button onClick={() => onSelect(dummyEvent(item.series.title))}>
                  {`${item.series.title} #${padNumber(item.episode + 1, 3)}`}
                </Button>
              </li>
            ))}
          {!hasDailyAnime && (
            <li>
              <div>No daily anime found.</div>
            </li>
          )}
        </List>
      </section>
    );
  }
}

DailyAnime.propTypes = {
  routeKey: PropTypes.string,
  onSelect: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  items: mapStateToEntityList(state.entities.dailyAnime)
});

const mapDispatchToState = {
  fetchDailyAnime
};

export default connect(
  mapStateToProps,
  mapDispatchToState
)(DailyAnime);
