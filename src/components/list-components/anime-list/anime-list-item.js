import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import NewTabLink from '../../../components/new-tab-link';
import { Paths } from '../../../constants/paths';
import { Enums, Icons } from '../../../constants/values';
import { getKeyByValue } from '../../../utils/common';
import { formatDateTimeForDisplay } from '../../../utils/date';

const AnimeListItem = ({ item, addEpisode }) => {
  const hasMalId = !!item.malId;
  const hasLink = !!item.link;
  const statusIcon = item.isRepeat
    ? Icons.clockwise
    : item.status === Enums.anime.status.onhold
      ? Icons.pause
      : item.status === Enums.anime.status.completed ? Icons.tick : null;

  return (
    <li className="anime-item">
      <div>
        <time dateTime={item.updatedDate}>
          {formatDateTimeForDisplay(item.updatedDate)}
        </time>
        <h4>{item.title}</h4>
        <div className="flex-row start-center-contents">
          {!!addEpisode && (
            <button
              type="button"
              className="button-icon small rounded primary"
              icon="+"
              onClick={() => addEpisode(item._id)}
              disabled={
                item.status === Enums.anime.status.completed && !item.isRepeat
              }
            />
          )}
          <span>{`${item.episode}/${item.series_episodes || '??'}`}</span>
          {!!statusIcon && (
            <span
              className="button-icon small bold"
              icon={statusIcon}
              title={getKeyByValue(Enums.anime.status, item.status)}
            />
          )}
        </div>
        <div className="button-group">
          <Link
            to={`${Paths.base}${Paths.anime.view}${item._id}`}
            className="button ripple"
          >
            View
          </Link>
          <Link
            to={`${Paths.base}${Paths.anime.edit}${item._id}`}
            className="button ripple"
          >
            Edit
          </Link>
        </div>
      </div>
      <div className="flex-spacer" />
      {(hasMalId || hasLink) && (
        <div className="mal-image">
          {hasMalId && (
            <NewTabLink
              href={`https://myanimelist.net/anime/${item.malId}`}
              className="mal-link"
              title="Open MAL entry in new tab."
            >
              <img
                src="https://myanimelist.net/favicon.ico"
                alt="MyAnimelist icon"
              />
            </NewTabLink>
          )}
          {hasLink && (
            <NewTabLink
              href={item.link}
              className="button-icon small"
              icon={Icons.link}
              title="Open content link"
            />
          )}
        </div>
      )}
      <div className="series-image-container">
        <img src={item.image} alt={`Cover for ${item.title}`} />
      </div>
    </li>
  );
};

AnimeListItem.propTypes = {
  item: PropTypes.object.isRequired,
  addEpisode: PropTypes.func
};

export default AnimeListItem;
