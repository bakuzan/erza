import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import List from 'meiko/List';
import { ButtonIcon, Button } from 'components/Buttonised';
import withMedia from 'components/withMedia';
import { fetchDailyAnime } from 'actions/dailyAnime';
import { Icons } from 'constants/values';
import { padNumber, getDayName } from 'utils';
import { mapStateToEntityList } from 'utils/data';
import { dailyAnimeHideOn } from 'utils/media';
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

function DailyAnime({ fetchDailyAnime, routeKey, items, onSelect, ...props }) {
  const [dateOffset, setDateOffset] = useState(7);
  const date = new Date();
  date.setDate(date.getDate() - dateOffset);

  const hasDailyAnime = !!items.length;
  const displayText = createOffsetText(dateOffset, date);
  const count = items.length;
  const countText = `${count} ${count === 1 ? 'episode' : 'episodes'} left`;

  useEffect(() => {
    fetchDailyAnime(dateOffset);
  }, [routeKey, dateOffset, fetchDailyAnime]);

  function handleDayChange(change) {
    setDateOffset((prev) => prev + change);
  }

  return (
    <section className="daily-animeContainer">
      <header className="daily-anime-header">
        <ButtonIcon
          btnStyle="primary"
          icon={Icons.left}
          aria-label="Previous Daily Anime"
          disabled={dateOffset > 6}
          onClick={() => handleDayChange(1)}
        />
        <div className="daily-anime-header__text">
          <div>{displayText}</div>
          <div>{countText}</div>
        </div>
        <ButtonIcon
          btnStyle="primary"
          icon={Icons.right}
          aria-label="Next Daily Anime"
          disabled={dateOffset === 1}
          onClick={() => handleDayChange(-1)}
        />
      </header>
      <List columns={1}>
        {hasDailyAnime &&
          items.map((item) => (
            <li key={item.id}>
              <Button onClick={() => onSelect(dummyEvent(item.title))}>
                {`${item.title} #${padNumber(item.episode + 1, 3)}`}
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
)(withMedia(DailyAnime, dailyAnimeHideOn));
